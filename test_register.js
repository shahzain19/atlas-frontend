import axios from 'axios';

async function testRegister() {
    try {
        console.log('Sending registration request to http://localhost:3001/api/auth/register...');
        const res = await axios.post('http://localhost:3001/api/auth/register', {
            username: 'testuser_' + Date.now(),
            password: 'testpassword123'
        });
        console.log('Registration Success:', res.data);
    } catch (err) {
        if (err.response) {
            console.error('Registration Failed (Server Error):', err.response.status, err.response.data);
        } else {
            console.error('Registration Failed (Network/Other Error):', err.message);
        }
    }
}

testRegister();
