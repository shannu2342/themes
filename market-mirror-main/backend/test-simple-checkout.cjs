const http = require('http');

// Test with minimal data to see Stripe session creation
const minimalData = {
  cartItems: [{
    product: {
      id: 'test-product-id',
      title: 'Test Product',
      description: 'Test Description',
      price: 15.00 // $15 USD
    }
  }],
  billingInfo: {
    email: 'test@example.com',
    name: 'Test User',
    address: '123 Test Street'
  },
  user_id: 'test-user-123'
};

const postData = JSON.stringify(minimalData);

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/create-checkout-session',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Testing Stripe session creation with $15 USD...');
console.log('Request data:', JSON.stringify(minimalData, null, 2));

const req = http.request(options, (res) => {
  console.log(`\nStatus: ${res.statusCode}`);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\nResponse body:');
    try {
      const response = JSON.parse(data);
      console.log(JSON.stringify(response, null, 2));
      
      if (response.url) {
        console.log('\n✅ SUCCESS! Stripe Checkout URL created:');
        console.log(response.url);
      }
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`Request error: ${e.message}`);
});

req.write(postData);
req.end();
