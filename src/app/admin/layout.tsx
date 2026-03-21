import { ReactNode } from "react";
import { auth } from "@/auth";
import AdminLayoutClient from "./admin-layout-client";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const session = await auth();
    let fullUser = null;

    if (session?.user?.email) {
        await connectDB();
        const dbUser = await User.findOne({ email: session.user.email }).lean();
        if (dbUser) {
            fullUser = {
                name: dbUser.username,
                email: dbUser.email,
                avatar: dbUser.avatar,
            };
        }
    }

    return (
        <AdminLayoutClient user={fullUser || (session?.user as any)}>
            {children}
        </AdminLayoutClient>
    );
}
