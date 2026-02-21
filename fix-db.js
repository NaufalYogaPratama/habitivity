const { MongoClient } = require('mongodb');

async function run() {
    const uri = "mongodb+srv://naufalyoga_db_user:DMLMhwU4PnHizlfR@cluster0.l9kzo6v.mongodb.net/?appName=Cluster0";
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('test'); // The default db name often used by Mongoose if not specified
        console.log("Connected to MongoDB...");
        const res = await db.collection('users').updateMany(
            { accountStatus: { $exists: false } },
            { $set: { accountStatus: 'active' } }
        );
        console.log('Update result:', res);
    } catch (e) {
        console.error("DB Update Error", e);
    } finally {
        await client.close();
    }
}
run();
