import mongoose from 'mongoose';
import connectDB from './src/lib/db/mongodb';
import ShopItem from './src/models/ShopItem';

async function test() {
  await connectDB();
  const items = await ShopItem.find({});
  console.log("Total items:", items.length);
  const activeItems = await ShopItem.find({ isActive: true });
  console.log("Active items:", activeItems.length);
  if (items.length > 0) console.log(items[0]);
  process.exit(0);
}
test();
