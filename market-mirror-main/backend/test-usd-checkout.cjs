const http = require('http');

// Test with $15 product (should work now)
const usdData = {
  cartItems: [{
    product: {
      id: 'test-product',
      title: 'Test Product',
      description: 'Test',
      price: 15 // $15 - above minimum $0.50
    }
  }],
  billingInfo: {
    email: 'test@example.com',
    name: 'Test User',
    address: '123 Test St'
  },
  user_id: 'test-user-id'
};

function testCheckout(data, testName) {
  const postData = JSON.stringify(data);

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

  const req = http.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      console.log(`\n${testName}:`);
      console.log(`Status: ${res.statusCode}`);
      try {
        const response = JSON.parse(responseData);
        console.log(`Response: ${JSON.stringify(response, null, 2)}`);
        
        if (response.url) {
          console.log(`✅ Stripe Checkout URL: ${response.url}`);
        }
      } catch (e) {
        console.log(`Response: ${responseData}`);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.write(postData);
  req.end();
}

console.log('Testing USD checkout with $15 product...');

// Test $15 product (should work)
testCheckout(usdData, 'Test with $15 USD product');
