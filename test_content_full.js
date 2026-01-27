// Test Content Management with Tags and Sources
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';
let token = '';
let contentId = '';

async function testContent() {
    console.log('📝 Testing Atlas Content Management System\n');

    try {
        // First, register and login to get a token
        console.log('Setting up: Creating test user...');
        try {
            const registerRes = await axios.post(`${API_URL}/auth/register`, {
                username: 'contentcreator',
                email: 'creator@atlas.com',
                password: 'password123'
            });
            token = registerRes.data.token;
            console.log(`✓ User created with role: ${registerRes.data.user.role}\n`);
        } catch (error) {
            // User might already exist, try logging in
            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                identifier: 'creator@atlas.com',
                password: 'password123'
            });
            token = loginRes.data.token;
            console.log('✓ Logged in with existing user\n');
        }

        // Test 1: Create content with tags and sources
        console.log('Test 1: Creating content with tags and sources...');
        const createRes = await axios.post(`${API_URL}/content`, {
            title: 'Understanding Sovereign Wealth',
            body: '# The Nature of Wealth\n\nTrue wealth is not measured in currency, but in **productive capacity** and **leverage**.\n\n## Key Principles\n\n1. Ownership of assets\n2. Control of systems\n3. Access to networks',
            category: 'money',
            status: 'published',
            tags: ['wealth', 'sovereignty', 'economics'],
            sources: [
                {
                    title: 'The Wealth of Nations',
                    author: 'Adam Smith',
                    type: 'book',
                    url: 'https://example.com/wealth-of-nations'
                },
                {
                    title: 'Modern Economic Theory',
                    author: 'Various',
                    type: 'article'
                }
            ]
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        contentId = createRes.data.id;
        console.log('✓ Content created successfully!');
        console.log(`  ID: ${contentId}`);
        console.log(`  Title: ${createRes.data.title}\n`);

        // Test 2: Get content with full details
        console.log('Test 2: Fetching content with details...');
        const getRes = await axios.get(`${API_URL}/content/${contentId}`);
        console.log('✓ Content retrieved!');
        console.log(`  Tags: ${getRes.data.tags.map(t => t.name).join(', ')}`);
        console.log(`  Sources: ${getRes.data.sources.length} citations`);
        console.log(`  Author: ${getRes.data.author_name || 'System'}`);
        console.log(`  Views: ${getRes.data.view_count}\n`);

        // Test 3: Search for content
        console.log('Test 3: Searching for "wealth"...');
        const searchRes = await axios.get(`${API_URL}/search`, {
            params: { q: 'wealth' }
        });
        console.log('✓ Search successful!');
        console.log(`  Found ${searchRes.data.count} results\n`);

        // Test 4: Get all tags
        console.log('Test 4: Fetching all tags...');
        const tagsRes = await axios.get(`${API_URL}/tags`);
        console.log('✓ Tags retrieved!');
        tagsRes.data.slice(0, 5).forEach(tag => {
            console.log(`  - ${tag.name} (used ${tag.usage_count} times)`);
        });
        console.log();

        // Test 5: Filter content by tag
        if (tagsRes.data.length > 0) {
            const firstTag = tagsRes.data[0];
            console.log(`Test 5: Getting content with tag "${firstTag.name}"...`);
            const tagContentRes = await axios.get(`${API_URL}/tags/${firstTag.slug}/content`);
            console.log('✓ Tag filter successful!');
            console.log(`  Found ${tagContentRes.data.length} articles\n`);
        }

        // Test 6: Update content
        console.log('Test 6: Updating content...');
        await axios.put(`${API_URL}/content/${contentId}`, {
            title: 'Understanding Sovereign Wealth [Updated]',
            featured: true
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✓ Content updated!\n');

        // Test 7: Tag autocomplete
        console.log('Test 7: Testing tag autocomplete...');
        const autocompleteRes = await axios.get(`${API_URL}/tags/autocomplete`, {
            params: { q: 'wea' }
        });
        console.log('✓ Autocomplete working!');
        console.log(`  Suggestions: ${autocompleteRes.data.map(t => t.name).join(', ')}\n`);

        console.log('✅ All content management tests passed!\n');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
        }
        process.exit(1);
    }
}

testContent();
