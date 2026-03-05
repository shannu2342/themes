const http = require('http');

// Test with low amount (should fail)
const lowAmountData = {
  cartItems: [{
    product: {
      id: 'test-product',
      title: 'Test Product',
      description: 'Test',
      price: 15 // ₹15 - below minimum
    }
  }],
  billingInfo: {
    email: 'test@example.com',
    name: 'Test User',
    address: '123 Test St'
  },
  user_id: 'test-user-id'
};

// Test with sufficient amount (should pass)
const sufficientAmountData = {
  cartItems: [{
    product: {
      id: 'test-product',
      title: 'Test Product',
      description: 'Test',
      price: 50 // ₹50 - above minimum
    }
  }],
  billingInfo: {
    email: 'test@example.com',
    name: 'Test User',
    address: '123 Test St'
  },
  user_id: 'test-user-id'
};

function testAmount(data, testName) {
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

console.log('Testing minimum amount validation...');

// Test low amount (should fail)
testAmount(lowAmountData, 'Test with ₹15 (below minimum)');

// Test sufficient amount (should pass)
setTimeout(() => {
  testAmount(sufficientAmountData, 'Test with ₹50 (above minimum)');
}, 1000);
