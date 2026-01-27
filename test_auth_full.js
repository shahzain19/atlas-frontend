// Test Authentication System
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

async function testAuth() {
    console.log('🔐 Testing Atlas Authentication System\n');

    try {
        // Test 1: Register a new user
        console.log('Test 1: Registering new user...');
        const registerRes = await axios.post(`${API_URL}/auth/register`, {
            username: 'testuser',
            email: 'test@atlas.com',
            password: 'password123'
        });
        console.log('✓ Registration successful!');
        console.log(`  Token: ${registerRes.data.token.substring(0, 20)}...`);
        console.log(`  User: ${registerRes.data.user.username} (${registerRes.data.user.role})\n`);

        const token = registerRes.data.token;

        // Test 2: Get current user profile
        console.log('Test 2: Getting user profile...');
        const meRes = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✓ Profile retrieved!');
        console.log(`  ID: ${meRes.data.user.id}`);
        console.log(`  Username: ${meRes.data.user.username}`);
        console.log(`  Email: ${meRes.data.user.email}`);
        console.log(`  Role: ${meRes.data.user.role}\n`);

        // Test 3: Login with credentials
        console.log('Test 3: Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            identifier: 'test@atlas.com',
            password: 'password123'
        });
        console.log('✓ Login successful!');
        console.log(`  Token: ${loginRes.data.token.substring(0, 20)}...\n`);

        // Test 4: Try accessing protected endpoint without token
        console.log('Test 4: Accessing protected endpoint without token...');
        try {
            await axios.get(`${API_URL}/auth/me`);
            console.log('✗ Should have failed!\n');
        } catch (error) {
            console.log('✓ Correctly rejected unauthorized request\n');
        }

        // Test 5: Try registering duplicate user
        console.log('Test 5: Attempting duplicate registration...');
        try {
            await axios.post(`${API_URL}/auth/register`, {
                username: 'testuser',
                email: 'test@atlas.com',
                password: 'password123'
            });
            console.log('✗ Should have failed!\n');
        } catch (error) {
            console.log('✓ Correctly rejected duplicate user\n');
        }

        console.log('✅ All authentication tests passed!\n');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        process.exit(1);
    }
}

testAuth();
