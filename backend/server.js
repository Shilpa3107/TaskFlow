const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => console.log('🟢 MongoDB connected'))
    .catch(err => console.error('🔴 MongoDB error:', err));

// Routes
const taskRoutes = require('../backend/routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

// Health
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

module.exports = app;
