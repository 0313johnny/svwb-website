import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const MONGO_URI =
  'mongodb+srv://0313johnny_db_user:***REDACTED***@shadowversewb-data.rurwnd2.mongodb.net/?appName=ShadowverseWB-Data';
const client = new MongoClient(MONGO_URI);
const dbName = 'shadowverse_wb';

async function startServer() {
  await client.connect();
  console.log('Connected to MongoDB Atlas');
  const db = client.db(dbName);
  const cardsCollection = db.collection('cards');

  app.get('/api/cards', async (req, res) => {
    try {
      const classId = req.query.class_id ? parseInt(req.query.class_id) : 0;
      const cards = await cardsCollection
        .find({ class_id: classId })
        .sort({ cost: 1 })
        .toArray();
      res.json({ success: true, count: cards.length, data: cards });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
