import connectDB from './src/lib/db/mongodb';
import User from './src/models/User';
import mongoose from 'mongoose';

async function run() {
    await connectDB();
    await User.updateMany(
        { accountStatus: { $exists: false } },
        { $set: { accountStatus: 'active' } }
    );
    console.log('Fixed DB accountStatus issue.');
    mongoose.disconnect();
}
run();
