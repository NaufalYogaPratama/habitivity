import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import ShopItem from '@/models/ShopItem';
import { auth } from '@/auth';

export async function POST(request: Request) {
    try {
        const session = await auth();
        const user = session?.user as { role?: string };
        if (user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Basic validation
        if (!body.name || !body.type || !body.price) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connectDB();

        const newItem = await ShopItem.create(body);
        return NextResponse.json(newItem, { status: 201 });
    } catch (error: any) {
        console.error('Admin POST Shop Item Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await auth();
        const user = session?.user as { role?: string };
        if (user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
        }

        await connectDB();

        const updatedItem = await ShopItem.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedItem) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        return NextResponse.json(updatedItem);
    } catch (error: any) {
        console.error('Admin PUT Shop Item Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await auth();
        const user = session?.user as { role?: string };
        if (user?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
        }

        await connectDB();

        const deletedItem = await ShopItem.findByIdAndDelete(id);

        if (!deletedItem) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Item deleted successfully' });
    } catch (error: any) {
        console.error('Admin DELETE Shop Item Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
