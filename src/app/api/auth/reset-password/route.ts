import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, newPassword } = body;

        if (!email || !newPassword) {
            return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
        }

        await connectDB();

        // Cari user berdasarkan email
        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return NextResponse.json({ error: 'Akun dengan email tersebut tidak ditemukan' }, { status: 404 });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update to database
        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({ success: true, message: 'Password berhasil direset' }, { status: 200 });
    } catch (error: any) {
        console.error('Password Reset Error:', error);
        return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 });
    }
}
