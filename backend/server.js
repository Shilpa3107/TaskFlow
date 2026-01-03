const express = require('express');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Configuration
const uri = "mongodb+srv://shilpa1work_db_user:oHyYQ1Dett0XkJ7p@cluster0.bsixtno.mongodb.net/?appName=Cluster0";

// Native MongoDB Client Connection (as requested)
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (err) {
        console.error("MongoClient connection error:", err);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);

// Mongoose Connection (used by your models)
const MONGODB_URI = process.env.MONGODB_URI || uri;

mongoose.connection.on('connected', () => console.log('🟢 Mongoose connected to MongoDB'));
mongoose.connection.on('error', (err) => console.error('🔴 Mongoose connection error:', err));
mongoose.connection.on('disconnected', () => console.log('� Mongoose disconnected'));

mongoose.connect(MONGODB_URI, { dbName: 'test' })
    .catch(err => console.error('🔴 Initial Mongoose connection error:', err));

// Routes
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

// Health
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

module.exports = app;
