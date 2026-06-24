import { config } from 'dotenv';
config({ path: '.env.local' });
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT ?? 3000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? 'http://localhost:9000';

app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error('MONGO_URI environment variable is not set');
const client = new MongoClient(MONGO_URI);
const dbName = 'shadowverse_wb';

async function startServer() {
  await client.connect();
  console.log('Connected to MongoDB Atlas');
  const db = client.db(dbName);
  const cardsCollection = db.collection('cards');

  app.get('/api/cards', async (req, res) => {
    try {
      const query = req.query.class_id !== undefined
        ? { class_id: parseInt(req.query.class_id) }
        : {};
      const cards = await cardsCollection
        .find(query)
        .sort({ cost: 1 })
        .toArray();
      res.json({ success: true, count: cards.length, data: cards });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);
