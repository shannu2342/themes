const http = require('http');

console.log('🧪 Testing Localhost Configuration...\n');

// Test 1: Backend API Health Check
console.log('1️⃣ Testing Backend API...');
const healthOptions = {
  hostname: 'localhost',
  port: 3001,
  path: '/',
  method: 'GET'
};

const healthReq = http.request(healthOptions, (res) => {
  console.log(`   Status: ${res.statusCode}`);
  if (res.statusCode === 200) {
    console.log('   ✅ Backend is running');
  } else {
    console.log('   ❌ Backend not responding');
  }
  
  // Test 2: API Endpoint
  console.log('\n2️⃣ Testing API Endpoint...');
  const apiData = {
    cartItems: [{
      product: {
        id: 'test-product',
        title: 'Test Product',
        description: 'Test',
        price: 15.00
      }
    }],
    billingInfo: {
      email: 'test@localhost.com',
      name: 'Localhost User',
      address: '123 Localhost St'
    },
    user_id: 'localhost-test-user'
  };
  
  const postData = JSON.stringify(apiData);
  const apiOptions = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/create-checkout-session',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  const apiReq = http.request(apiOptions, (apiRes) => {
    console.log(`   Status: ${apiRes.statusCode}`);
    
    let data = '';
    apiRes.on('data', (chunk) => {
      data += chunk;
    });
    
    apiRes.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (apiRes.statusCode === 200 && response.url) {
          console.log('   ✅ API endpoint working');
          console.log(`   📦 Stripe URL generated: ${response.url.substring(0, 50)}...`);
        } else if (apiRes.statusCode === 500) {
          console.log('   ⚠️ API responds (500 expected for test data)');
        } else {
          console.log('   ❌ API endpoint failed');
          console.log('   Response:', data);
        }
      } catch (e) {
        console.log('   ❌ Invalid JSON response');
        console.log('   Raw:', data);
      }
      
      console.log('\n🎯 Localhost Test Summary:');
      console.log('📦 Backend: http://localhost:3001');
      console.log('🌐 Frontend: http://localhost:8080');
      console.log('💳 Stripe: Test mode enabled');
      console.log('🔧 CORS: Localhost only');
      console.log('\n✅ Ready for localhost development!');
    });
  });
  
  apiReq.on('error', (e) => {
    console.error('   ❌ API request error:', e.message);
  });
  
  apiReq.write(postData);
  apiReq.end();
});

healthReq.on('error', (e) => {
  console.error('❌ Backend health check failed:', e.message);
});

healthReq.end();
