const path = require('path');
const fs = require('fs');

const localEnvPath = path.resolve(__dirname, '.env');
const rootEnvPath = path.resolve(__dirname, '../.env');
const selectedEnvPath = fs.existsSync(localEnvPath) ? localEnvPath : rootEnvPath;
require('dotenv').config({ path: selectedEnvPath });

const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Supabase
const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
const supabaseServiceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    'Missing required Supabase environment variables. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
  );
}

function decodeJwtPayload(jwt) {
  const parts = jwt.split('.');
  if (parts.length !== 3) return null;
  try {
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);
    return JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}

if (!/^https:\/\/.+\.supabase\.co/.test(supabaseUrl)) {
  throw new Error('Invalid SUPABASE_URL. Expected something like https://<project-ref>.supabase.co');
}

if (supabaseServiceRoleKey.split('.').length !== 3) {
  throw new Error('Invalid SUPABASE_SERVICE_ROLE_KEY format. Paste the full "service_role" key from Supabase Project Settings -> API.');
}

const decodedKey = decodeJwtPayload(supabaseServiceRoleKey);
if (!decodedKey || !decodedKey.ref || !decodedKey.role) {
  throw new Error('Invalid SUPABASE_SERVICE_ROLE_KEY payload. Re-copy the "service_role" key from Supabase Project Settings -> API.');
}

console.log(`🔧 Env loaded from: ${selectedEnvPath}`);
console.log(`🔧 Supabase key payload: ref=${decodedKey.ref}, role=${decodedKey.role}`);

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Middleware
const corsOptions = {
  origin: true,
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature'],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

// API: Check if product already purchased
app.post('/api/check-purchase-status', async (req, res) => {
  try {
    const { user_id, product_id } = req.body;

    if (!user_id || !product_id) {
      return res.status(400).json({ error: 'Missing user_id or product_id' });
    }

    // Check if product is already in purchased_products
    const { data: existingPurchase, error } = await supabase
      .from('purchased_products')
      .select('*')
      .eq('user_id', user_id)
      .eq('product_id', product_id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error checking purchase status:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ 
      already_purchased: !!existingPurchase,
      purchase_date: existingPurchase?.purchased_at || null
    });
  } catch (error) {
    console.error('Check purchase status error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/mark-order-cancelled', async (req, res) => {
  try {
    const { session_id } = req.body;

    if (!session_id) {
      return res.status(400).json({ error: 'Missing session_id' });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const user_id = session.metadata?.user_id;
    if (!user_id) {
      return res.status(400).json({ error: 'User ID not found in session' });
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('stripe_session_id', session_id)
      .eq('user_id', user_id)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.payment_status === 'completed') {
      return res.json({ success: true, order_id: order.id, payment_status: order.payment_status });
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('Error updating cancelled order:', updateError);
      return res.status(500).json({ error: 'Failed to update order' });
    }

    res.json({ success: true, order_id: order.id, payment_status: 'cancelled' });
  } catch (error) {
    console.error('Mark cancelled error:', error);
    res.status(500).json({ error: error.message });
  }
});

// API: Verify payment and create purchase record
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { session_id } = req.body;

    if (!session_id) {
      return res.status(400).json({ error: 'Missing session_id' });
    }

    // Retrieve Stripe session
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Check payment status
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ 
        error: 'Payment not completed',
        status: session.payment_status 
      });
    }

    // Get user_id from session metadata
    const user_id = session.metadata?.user_id;
    if (!user_id) {
      return res.status(400).json({ error: 'User ID not found in session' });
    }

    // Find the order for this session
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('stripe_session_id', session_id)
      .eq('user_id', user_id)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update order status to completed
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        payment_status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('Error updating order:', updateError);
      return res.status(500).json({ error: 'Failed to update order' });
    }

    // Get order items to create purchase records
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('product_id, price')
      .eq('order_id', order.id);

    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
      return res.status(500).json({ error: 'Failed to fetch order items' });
    }

    // Create purchase records for each product
    for (const item of orderItems) {
      const purchaseData = {
        user_id: user_id,
        product_id: item.product_id,
        order_id: order.id,
        stripe_session_id: session_id,
        amount: item.price,
        currency: session.currency || 'inr'
      };

      const { error: purchaseError } = await supabase
        .from('purchased_products')
        .insert(purchaseData);

      if (purchaseError) {
        // If duplicate purchase (unique constraint), that's okay
        if (purchaseError.code !== '23505') {
          console.error('Error creating purchase record:', purchaseError);
          return res.status(500).json({ error: 'Failed to create purchase record' });
        }
      }
    }

    res.json({ 
      success: true,
      order_id: order.id,
      payment_status: 'completed',
      products_count: orderItems.length
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create Stripe Checkout Session (Updated with validation)
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { cartItems, billingInfo, user_id } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'No items in cart' });
    }

    if (!user_id) {
      return res.status(400).json({ error: 'User ID required' });
    }

    // Check if any products are already purchased
    for (const item of cartItems) {
      const { data: existingPurchase } = await supabase
        .from('purchased_products')
        .select('*')
        .eq('user_id', user_id)
        .eq('product_id', item.product.id)
        .single();

      if (existingPurchase) {
        return res.status(400).json({ 
          error: `Product "${item.product.title}" is already purchased`,
          already_purchased: true,
          product_id: item.product.id
        });
      }
    }

    // Calculate total amount (convert to cents for USD)
    const totalAmount = Math.round(cartItems.reduce((total, item) => total + item.product.price * 100, 0));
    
    // Ensure minimum amount of 50 cents USD
    if (totalAmount < 50) {
      return res.status(400).json({ 
        error: `Minimum order amount is $0.50. Your current total is $${(totalAmount / 100).toFixed(2)}.`,
        minimum_amount: 0.50,
        current_amount: totalAmount / 100
      });
    }

    // Transform cart items for Stripe (using USD currency)
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.title,
          description: item.product.description || 'Digital product',
          images: item.product.images || [],
        },
        unit_amount: Math.round(item.product.price * 100), // Convert to cents
      },
      quantity: 1,
    }));

    const rawOrigin = Array.isArray(req.headers.origin) ? req.headers.origin[0] : req.headers.origin;
    const rawFrontendBaseUrl = (process.env.FRONTEND_BASE_URL || rawOrigin || 'http://localhost:8080').trim();
    const frontendBaseUrl = rawFrontendBaseUrl.replace(/\/$/, '');

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${frontendBaseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendBaseUrl}/cancel?session_id={CHECKOUT_SESSION_ID}&cancelled=true`,
      customer_email: billingInfo.email,
      currency: 'usd',
      metadata: {
        user_id: user_id || '',
        billing_name: billingInfo.name,
        billing_address: billingInfo.address,
        // Store only product IDs and quantities to stay within metadata limits
        product_ids: cartItems.map(item => item.product.id).join(','),
        total_amount: cartItems.reduce((total, item) => total + item.product.price, 0).toString()
      },
    });

    // Create order with pending status
    const orderData = {
      user_id: user_id,
      total_price: cartItems.reduce((total, item) => total + item.product.price, 0),
      payment_status: 'pending',
      payment_method: 'stripe',
      billing_name: billingInfo.name,
      billing_email: billingInfo.email,
      billing_address: billingInfo.address,
      stripe_session_id: session.id,
      currency: 'usd',
    };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return res.status(500).json({ error: 'Failed to create order' });
    }

    // Create order items
    for (const item of cartItems) {
      const orderItemData = {
        order_id: order.id,
        product_id: item.product.id,
        price: item.product.price,
      };

      const { error: itemError } = await supabase
        .from('order_items')
        .insert(orderItemData);

      if (itemError) {
        console.error('Error creating order item:', itemError);
        return res.status(500).json({ error: 'Failed to create order items' });
      }
    }

    res.json({ url: session.url, order_id: order.id });
  } catch (error) {
    console.error('Stripe session creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook endpoint for Stripe events
app.post('/stripe-webhook', express.json(), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  // Skip signature verification for localhost testing
  try {
    event = req.body;
    console.log('🔓 Localhost mode - webhook signature verification skipped');
  } catch (err) {
    console.log('❌ Invalid JSON body:', err.message);
    return res.status(400).send('Invalid JSON body');
  }

    // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('💰 Payment successful:', session.id);
      console.log('📧 Customer email:', session.customer_email);
      console.log('👤 User ID:', session.metadata.user_id);
      console.log('💵 Amount:', session.amount_total / 100);
      console.log('📦 Product IDs:', session.metadata.product_ids);
      
      // Only process if payment is actually paid
      if (session.payment_status === 'paid') {
        try {
          // Find the order for this session
          const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('stripe_session_id', session.id)
            .eq('user_id', session.metadata.user_id)
            .single();

          if (orderError || !order) {
            console.error('❌ Order not found for session:', session.id);
            break;
          }

          // Update order status to completed
          const { error: updateError } = await supabase
            .from('orders')
            .update({ 
              payment_status: 'completed',
              updated_at: new Date().toISOString()
            })
            .eq('id', order.id);

          if (updateError) {
            console.error('❌ Error updating order:', updateError);
            break;
          }

          console.log('✅ Order updated to paid:', order.id);

          // Get order items to create purchase records
          const { data: orderItems, error: itemsError } = await supabase
            .from('order_items')
            .select('product_id, price')
            .eq('order_id', order.id);

          if (itemsError) {
            console.error('❌ Error fetching order items:', itemsError);
            break;
          }

          console.log('📦 Found order items:', orderItems.length);

          // Create purchase records for each product
          for (const item of orderItems) {
            const purchaseData = {
              user_id: session.metadata.user_id,
              product_id: item.product_id,
              order_id: order.id,
              stripe_session_id: session.id,
              amount: item.price,
              currency: session.currency || 'usd'
            };

            const { error: purchaseError } = await supabase
              .from('purchased_products')
              .insert(purchaseData);

            if (purchaseError) {
              // If duplicate purchase (unique constraint), that's okay
              if (purchaseError.code !== '23505') {
                console.error('❌ Error creating purchase record:', purchaseError);
              } else {
                console.log('ℹ️ Purchase already exists for product:', item.product_id);
              }
            } else {
              console.log('✅ Purchase record created for product:', item.product_id);
            }
          }

          // Clear the user's cart after successful payment
          try {
            const { error: cartError } = await supabase
              .from('cart_items')
              .delete()
              .eq('user_id', session.metadata.user_id);

            if (cartError) {
              console.error('❌ Error clearing cart:', cartError);
            } else {
              console.log('🛒 Cart cleared successfully after payment');
            }
          } catch (cartClearError) {
            console.error('❌ Error clearing cart:', cartClearError);
          }

          console.log('🎉 Payment processing completed successfully!');
          
        } catch (error) {
          console.error('❌ Error processing payment:', error);
        }
      } else {
        console.log('⏰ Payment not yet completed, status:', session.payment_status);
      }
      break;
    case 'checkout.session.expired':
      console.log('⏰ Payment session expired:', session.id);
      // No order created - user will need to try again
      break;
    default:
      console.log(`ℹ️ Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

app.listen(PORT, () => {
  console.log(`💳 Payment backend server running on http://localhost:${PORT}`);
  console.log('📡 Available endpoints:');
  console.log('  POST /api/create-checkout-session');
  console.log('  POST /api/verify-payment');
  console.log('  POST /api/check-purchase-status');
  console.log('  POST /stripe-webhook');
});
