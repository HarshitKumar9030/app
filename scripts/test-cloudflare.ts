/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Test script to verify Cloudflare configuration and API access
 * Run with: tsx scripts/test-cloudflare.ts
 */

import https from 'https';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;

console.log('🔍 Testing Cloudflare Configuration...\n');

// Check environment variables
console.log('📋 Environment Variables:');
console.log(`CLOUDFLARE_API_TOKEN: ${CLOUDFLARE_API_TOKEN ? '✅ Set' : '❌ Missing'}`);
console.log(`CLOUDFLARE_ZONE_ID: ${CLOUDFLARE_ZONE_ID ? '✅ Set' : '❌ Missing'}`);

if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ZONE_ID) {
  console.log('\n❌ Missing required environment variables. Please check your .env.local file.');
  process.exit(1);
}

// Test API token validation
async function testApiToken() {
  console.log('\n🔑 Testing API Token...');
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.cloudflare.com',
      port: 443,
      path: '/client/v4/user',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
        
        try {
          const response = JSON.parse(data);
          
          if (res.statusCode === 200 && response.success) {
            console.log(`✅ API Token valid for user: ${response.result.email}`);
            resolve(response.result);
          } else {
            console.log('❌ API Token validation failed');
            if (response.errors) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              response.errors.forEach((error: { code: any; message: any; }) => {
                console.log(`   Error ${error.code}: ${error.message}`);
              });
            }
            reject(new Error('API Token validation failed'));
          }
        } catch (e) {
          console.log('❌ Failed to parse response:', data);
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      console.log('❌ Request failed:', e.message);
      reject(e);
    });

    req.end();
  });
}

// Test zone access
async function testZoneAccess() {
  console.log('\n🌐 Testing Zone Access...');
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.cloudflare.com',
      port: 443,
      path: `/client/v4/zones/${CLOUDFLARE_ZONE_ID}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
        
        try {
          const response = JSON.parse(data);
          
          if (res.statusCode === 200 && response.success) {
            console.log(`✅ Zone access granted for: ${response.result.name}`);
            console.log(`   Zone ID: ${response.result.id}`);
            console.log(`   Status: ${response.result.status}`);
            resolve(response.result);
          } else {
            console.log('❌ Zone access denied');
            if (response.errors) {
              response.errors.forEach((error: { code: any; message: any; }) => {
                console.log(`   Error ${error.code}: ${error.message}`);
              });
            }
            reject(new Error('Zone access denied'));
          }
        } catch (e) {
          console.log('❌ Failed to parse response:', data);
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      console.log('❌ Request failed:', e.message);
      reject(e);
    });

    req.end();
  });
}

// Run tests
async function runTests() {
  try {
    await testApiToken();
    await testZoneAccess();
    
    console.log('\n✅ All tests passed! Cloudflare configuration is valid.');
  } catch (error) {
    if (error instanceof Error) {
      console.log('\n❌ Tests failed:', error.message);
    } else {
      console.log('\n❌ Tests failed:', error);
    }
    
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Verify your API token has the correct permissions:');
    console.log('   - Zone:Zone:Read');
    console.log('   - Zone:DNS:Edit');
    console.log('2. Check that the Zone ID is correct');
    console.log('3. Ensure the API token is not expired');
    console.log('4. Verify the zone is active in your Cloudflare account');
    
    process.exit(1);
  }
}

runTests();
