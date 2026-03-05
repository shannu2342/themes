<<<<<<< HEAD
# Payment Backend

A dedicated payment backend server for the market-mirror application.

## 🚀 Getting Started

### Install Dependencies
```bash
cd payment-backend
npm install
```

### Start the Server
```bash
npm start
# or
npm run dev
```

The server will run on `http://localhost:3001`

## 📡 Available Endpoints

- `POST /api/create-checkout-session` - Create Stripe checkout session
- `POST /api/verify-payment` - Verify payment completion
- `POST /api/check-purchase-status` - Check if product is purchased
- `POST /stripe-webhook` - Handle Stripe webhooks

## 🔧 Environment Variables

Create a `.env` file in the payment-backend folder:

```
STRIPE_SECRET_KEY=sk_test_...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 🎯 Features

- ✅ Stripe payment processing
- ✅ Order management
- ✅ Purchase tracking
- ✅ Webhook handling
- ✅ Cart clearing after payment
- ✅ CORS enabled for frontend

## 📝 Notes

- Uses Express.js server
- CommonJS modules (.cjs)
- CORS configured for localhost:8080
- Stripe webhook signature verification skipped for localhost
=======
# 💳 Payment Backend

A secure, production-ready Stripe payment backend for marketplace applications.

## 🚀 Features

- ✅ **Secure Stripe Checkout** - Hosted payment pages
- ✅ **Payment Verification** - Server-side confirmation
- ✅ **Duplicate Prevention** - No double purchases
- ✅ **Webhook Handling** - Real-time payment updates
- ✅ **Order Management** - Complete order lifecycle
- ✅ **Purchase Tracking** - User purchase history
- ✅ **CORS Support** - Multi-origin deployment
- ✅ **Health Checks** - Monitoring ready

## 📋 API Endpoints

### Core Payment APIs

#### `POST /api/create-checkout-session`
Creates a Stripe checkout session for payment processing.

**Request:**
```json
{
  "cartItems": [
    {
      "product": {
        "id": "product_123",
        "title": "Digital Product",
        "description": "Product description",
        "price": 15.00,
        "images": ["https://example.com/image.jpg"]
      }
    }
  ],
  "billingInfo": {
    "email": "user@example.com",
    "name": "John Doe",
    "address": "123 Main St"
  },
  "user_id": "user_123"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/pay/...",
  "order_id": "order_123"
}
```

#### `POST /api/verify-payment`
Verifies payment completion and creates purchase records.

**Request:**
```json
{
  "session_id": "cs_test_..."
}
```

**Response:**
```json
{
  "success": true,
  "order_id": "order_123",
  "payment_status": "completed",
  "products_count": 1
}
```

#### `POST /api/check-purchase-status`
Checks if a user has already purchased a product.

**Request:**
```json
{
  "user_id": "user_123",
  "product_id": "product_123"
}
```

**Response:**
```json
{
  "already_purchased": false,
  "purchase_date": null
}
```

### Webhook Endpoint

#### `POST /stripe-webhook`
Handles Stripe webhook events for real-time payment processing.

**Events handled:**
- `checkout.session.completed` - Payment successful
- `checkout.session.expired` - Payment expired

### Health Check

#### `GET /health`
Server health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "payment-backend"
}
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+
- Stripe account
- Supabase project

### 1. Clone Repository

```bash
git clone https://github.com/Dhruv-Chothani/payement-backend.git
cd payement-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your actual credentials:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URLs
FRONTEND_URL=http://localhost:8080,https://your-app.vercel.app
```

### 4. Database Setup

Run the SQL setup script in your Supabase project:

```sql
-- File: supabase/create-purchased-products-table.sql
```

### 5. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## 🚀 Deployment

### Environment Variables for Production

Set these in your deployment platform:

```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

### Deployment Options

#### Vercel
```bash
npm install -g vercel
vercel
```

#### Railway
```bash
npm install -g railway
railway login
railway link
railway up
```

#### Heroku
```bash
heroku create your-payment-backend
heroku config:set STRIPE_SECRET_KEY=sk_live_...
git push heroku main
```

#### DigitalOcean App Platform
1. Create new app
2. Connect GitHub repository
3. Set environment variables
4. Deploy

## 🔧 Configuration

### Stripe Setup

1. **Create Stripe Account**: https://dashboard.stripe.com/register
2. **Get API Keys**: Dashboard → Developers → API keys
3. **Setup Webhook**: Dashboard → Developers → Webhooks
   - Endpoint URL: `https://your-backend.com/stripe-webhook`
   - Events: `checkout.session.completed`

### Supabase Setup

1. **Create Project**: https://supabase.com/dashboard
2. **Get URLs**: Project Settings → API
3. **Run SQL**: Execute the setup script
4. **Configure RLS**: Set up row level security policies

## 🔒 Security Features

### Payment Security
- **Server-side verification** - No client-side payment processing
- **Stripe hosted checkout** - PCI compliance handled by Stripe
- **Webhook signature verification** - Prevents fake payment notifications
- **Duplicate purchase prevention** - Database constraints + API checks

### Data Security
- **Environment variables** - No hardcoded secrets
- **CORS configuration** - Cross-origin protection
- **Input validation** - Request sanitization
- **Error handling** - No sensitive data leakage

## 📊 Monitoring

### Health Checks
```bash
curl http://localhost:3001/health
```

### Logs
- Payment processing logs
- Error tracking
- Webhook event logs
- Database operation logs

### Metrics to Monitor
- Payment success rate
- API response times
- Error rates
- Webhook delivery

## 🧪 Testing

### Local Testing
```bash
# Test health check
curl http://localhost:3001/health

# Test API endpoints
npm run test
```

### Stripe Testing
Use Stripe test cards:
- **Visa**: `4242 4242 4242 4242`
- **Mastercard**: `5555 5555 5555 4444`
- **Declined**: `4000 0000 0000 0002`

## 🔄 API Integration

### Frontend Integration

Update your frontend to use these endpoints:

```javascript
// Create checkout session
const response = await fetch('https://your-backend.com/api/create-checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ cartItems, billingInfo, user_id })
});

// Verify payment
const result = await fetch('https://your-backend.com/api/verify-payment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ session_id })
});
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `FRONTEND_URL` environment variable
   - Verify allowed origins in server.js

2. **Stripe Webhook Issues**
   - Verify webhook endpoint URL
   - Check webhook secret in environment
   - Test with Stripe CLI

3. **Database Connection**
   - Verify Supabase credentials
   - Check RLS policies
   - Test database connectivity

4. **Payment Verification**
   - Check Stripe session status
   - Verify order creation
   - Review webhook logs

### Debug Mode

Enable debug logging:
```env
NODE_ENV=development
```

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Support

For support:
- Create an issue in the repository
- Check the troubleshooting guide
- Review the API documentation

---

**🚀 Ready to process secure payments!**
>>>>>>> ff6d8f6950fbc4764f3b88dfe04f723c845a2ac6
