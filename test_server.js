import express from 'express';
const app = express();
app.get('/test', (req, res) => res.send('OK'));
app.listen(3003, () => console.log('Test server on 3003'));
