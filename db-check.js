const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const items = await mongoose.connection.collection('shopitems').find({ isActive: true }).toArray();
  console.log("Found items:", items.length);
  process.exit(0);
}
check();
