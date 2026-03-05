// Test webhook endpoint
const http = require('http');

const data = JSON.stringify({
  type: 'checkout.session.completed',
  data: {
    object: {
      id: 'cs_test_' + Date.now(),
      customer_email: 'test@example.com',
      amount_total: 2999,
      currency: 'usd',
      metadata: {
        user_id: 'ff19f4ef-e3c0-4395-a99b-5ae1c9be05f0',
        billing_name: 'Test User',
        billing_address: '123 Test Street',
        product_ids: 'd1ea0181-6bdd-41e0-9729-b7ee91da2510',
        total_amount: '29.99'
      },
      payment_intent: 'pi_test_' + Date.now()
    }
  }
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/stripe-webhook',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
    'stripe-signature': 'test-signature'
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  res.on('data', (chunk) => {
    console.log(`Body: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(data);
req.end();

console.log('Testing webhook endpoint...');
