const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongodb:27017';
const DB_NAME = 'multiarch_db';

app.use(cors());
app.use(express.json());

let db;

async function connectToMongo() {
    try {
        const client = new MongoClient(MONGO_URL);
        await client.connect();
        db = client.db(DB_NAME);
        console.log('Połączono z MongoDB');
    } catch (error) {
        console.error('Błąd połączenia z MongoDB:', error);
        process.exit(1);
    }
}

app.get('/', (req, res) => {
    res.json({
        message: 'API działa na ARM64',
        architecture: process.arch,
        platform: process.platform,
        node_version: process.version
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'multi-arch-api' });
});

app.get('/users', async (req, res) => {
    try {
        const users = await db.collection('users').find({}).toArray();
        res.json({ users, count: users.length });
    } catch (error) {
        res.status(500).json({ error: 'Błąd pobierania użytkowników' });
    }
});

app.post('/users', async (req, res) => {
    try {
        const { name, email } = req.body;
        const result = await db.collection('users').insertOne({ name, email, created: new Date() });
        res.json({ success: true, id: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: 'Błąd dodawania użytkownika' });
    }
});

app.get('/info', (req, res) => {
    res.json({
        api_architecture: process.arch,
        api_platform: process.platform,
        mongodb_connected: !!db,
        timestamp: new Date().toISOString()
    });
});

async function startServer() {
    await connectToMongo();
    const existingUsers = await db.collection('users').countDocuments();
    if (existingUsers === 0) {
        await db.collection('users').insertMany([
            { name: 'Jan Kowalski', email: 'jan@example.com', created: new Date() },
            { name: 'Anna Nowak', email: 'anna@example.com', created: new Date() }
        ]);
        console.log('Dodano przykładowych użytkowników');
    }
    
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Serwer działa na porcie ${PORT}`);
        console.log(`Architektura: ${process.arch}`);
        console.log(`Platforma: ${process.platform}`);
    });
}

startServer().catch(console.error); 