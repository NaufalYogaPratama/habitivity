import { ReactNode } from "react";
import { auth } from "@/auth";
import AdminLayoutClient from "./admin-layout-client";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const session = await auth();
    const user = session?.user as { name?: string };

    return (
        <AdminLayoutClient user={user}>
            {children}
        </AdminLayoutClient>
    );
}
