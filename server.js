
const express = require('express');

const app = express();

// Home route
app.get('/', (req, res) => {
    res.status(200).send('Welcome to my Express Server!');
});

// About route
app.get('/about', (req, res) => {
    res.status(200).json({
        name: 'Jaya Varshini',
        section: 'CSE-AI/ML-2B-207'
    });
});

// Time route
app.get('/time', (req, res) => {
    res.status(200).json({
        currentDateTime: new Date()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});

// Start server
app.listen(3000, () => {
    console.log('Express server running at http://localhost:3000');
});
