import express from 'express';

const app = express();

app.use(express.json());

app.listen(12345, () => {
    console.log('Server is running on port 12345');
})