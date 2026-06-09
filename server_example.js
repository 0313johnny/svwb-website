const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 允許前端跨網域請求 (CORS)
app.use(cors());
app.use(express.json());

// MongoDB 連線設定 (指向你的本地資料庫)
const url_local = 'mongodb://localhost:27017';
const url = 'mongodb+srv://0313johnny_db_user:***REDACTED***@shadowversewb-data.rurwnd2.mongodb.net/?appName=ShadowverseWB-Data';
const client = new MongoClient(url);
const dbName = 'shadowverse_wb';

async function startServer() {
    try {
        await client.connect();
        console.log('🔌 成功連線至本地 MongoDB！');
        const db = client.db(dbName);
        const cardsCollection = db.collection('cards');

        // 核心 API：根據職業篩選卡片，並按費用遞增排序
        app.get('/api/cards', async (req, res) => {
            try {
                // 從前端的網址參數取得 class_id，例如 /api/cards?class_id=1
                const classId = req.query.class_id ? parseInt(req.query.class_id) : 0;
                
                // 查詢條件：class_id 匹配
                // 排序條件：cost: 1 (代表遞增、由小到大)
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
            console.log(`🚀 後端伺服器正運行於 http://localhost:${PORT}`);
        });

    } catch (e) {
        console.error('❌ 資料庫連線失敗：', e);
    }
}

startServer();