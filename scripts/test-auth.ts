/**
 * Test script for authentication endpoints
 * Run with: tsx scripts/test-auth.ts
 */

import { config } from 'dotenv';

config({ path: '.env.local' });

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

interface TestUser {
  email: string;
  password: string;
  username?: string;
}

const testUser: TestUser = {
  email: 'test@example.com',
  password: 'TestPassword123!',
  username: 'testuser'
};

async function makeRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();
  return { response, data };
}

async function testSignup() {
  console.log('\n🔍 Testing User Signup...');
  
  const { response, data } = await makeRequest('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      email: testUser.email,
      password: testUser.password,
      username: testUser.username
    })
  });

  console.log(`Status: ${response.status} ${response.statusText}`);
  
  if (response.status === 201 && data.success) {
    console.log('Signup successful');
    console.log(`   User ID: ${data.data.user.id}`);
    console.log(`   Email: ${data.data.user.email}`);
    console.log(`   API Key: ${data.data.user.apiKey.substring(0, 20)}...`);
    return data.data.user.apiKey;
  } else {
    console.log('Signup failed');
    console.log('   Error:', data.error?.message);
    if (data.error?.details) {
      console.log('   Details:', data.error.details);
    }
    return null;
  }
}

async function testLogin() {
  console.log('\nTesting User Login...');
  
  const { response, data } = await makeRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: testUser.email,
      password: testUser.password
    })
  });

  console.log(`Status: ${response.status} ${response.statusText}`);
  
  if (response.status === 200 && data.success) {
    console.log('Login successful');
    console.log(`   User ID: ${data.data.user.id}`);
    console.log(`   Email: ${data.data.user.email}`);
    console.log(`   API Key: ${data.data.user.apiKey.substring(0, 20)}...`);
    return data.data.user.apiKey;
  } else {
    console.log('Login failed');
    console.log('   Error:', data.error?.message);
    return null;
  }
}

async function testApiKeyVerification(apiKey: string) {
  console.log('\n🔍 Testing API Key Verification...');
  
  const { response, data } = await makeRequest('/api/auth/verify', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });

  console.log(`Status: ${response.status} ${response.statusText}`);
  
  if (response.status === 200 && data.success) {
    console.log('API key verification successful');
    console.log(`   User: ${data.data.user.email}`);
    console.log(`   Message: ${data.data.message}`);
    return true;
  } else {
    console.log('API key verification failed');
    console.log('   Error:', data.error?.message);
    return false;
  }
}

async function testUserProfile(apiKey: string) {
  console.log('\nTesting User Profile...');
  
  const { response, data } = await makeRequest('/api/auth/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });

  console.log(`Status: ${response.status} ${response.statusText}`);
  
  if (response.status === 200 && data.success) {
    console.log('Profile fetch successful');
    console.log(`   User: ${data.data.user.email}`);
    console.log(`   Created: ${data.data.user.createdAt}`);
    console.log(`   Deployments: ${data.data.stats.totalDeployments}`);
    console.log(`   Subdomains: ${data.data.stats.totalSubdomains}`);
    return true;
  } else {
    console.log('Profile fetch failed');
    console.log('   Error:', data.error?.message);
    return false;
  }
}

async function testApiKeyRegeneration() {
  console.log('\n🔍 Testing API Key Regeneration...');
  
  const { response, data } = await makeRequest('/api/auth/regenerate-key', {
    method: 'POST',
    body: JSON.stringify({
      email: testUser.email,
      password: testUser.password
    })
  });

  console.log(`Status: ${response.status} ${response.statusText}`);
  
  if (response.status === 200 && data.success) {
    console.log('API key regeneration successful');
    console.log(`   New API Key: ${data.data.apiKey.substring(0, 20)}...`);
    console.log(`   Message: ${data.data.message}`);
    return data.data.apiKey;
  } else {
    console.log('API key regeneration failed');
    console.log('   Error:', data.error?.message);
    return null;
  }
}

async function testInvalidApiKey() {
  console.log('\nTesting Invalid API Key...');
  
  const { response, data } = await makeRequest('/api/auth/verify', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer invalid_api_key_12345'
    }
  });

  console.log(`Status: ${response.status} ${response.statusText}`);
  
  if (response.status === 401) {
    console.log('Invalid API key correctly rejected');
    console.log(`   Error: ${data.error?.message}`);
    return true;
  } else {
    console.log('Invalid API key was not rejected properly');
    return false;
  }
}

async function runTests() {
  console.log('Starting Authentication System Tests');
  console.log(`API Base URL: ${API_BASE_URL}`);
  
  let apiKey: string | null = null;
  
  try {
    // Test signup (might fail if user already exists)
    apiKey = await testSignup();
    
    // If signup failed (user exists), try login
    if (!apiKey) {
      console.log('\nSignup failed (user might already exist), trying login...');
      apiKey = await testLogin();
    }
    
    if (!apiKey) {
      console.log('\nCould not obtain API key through signup or login');
      return;
    }
    
    // Test API key verification
    const verificationSuccess = await testApiKeyVerification(apiKey);
    if (!verificationSuccess) {
      console.log('\nAPI key verification failed, stopping tests');
      return;
    }
    
    // Test user profile
    await testUserProfile(apiKey);
    
    // Test API key regeneration
    const newApiKey = await testApiKeyRegeneration();
    if (newApiKey) {
      // Verify the new API key works
      await testApiKeyVerification(newApiKey);
    }
    
    // Test invalid API key
    await testInvalidApiKey();
    
    console.log('\nAll authentication tests completed!');
    
  } catch (error) {
    console.error('\nTest error:', error);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const { response } = await makeRequest('/api/health');
    if (response.ok) {
      console.log('Server is running');
      return true;
    }
  } catch {
    console.log('❌ Server is not running. Please start it with: pnpm dev');
    return false;
  }
  return false;
}

async function main() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runTests();
  }
}

main();
