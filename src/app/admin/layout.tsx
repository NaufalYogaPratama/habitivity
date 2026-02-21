import { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import { auth } from "@/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const session = await auth();
    const user = session?.user as { name?: string };

    return (
        <div className="flex bg-[#0B0E14] text-white min-h-screen font-sans selection:bg-purple-500/30">
            {/* Background Ambient */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-[20%] w-[600px] h-[600px] bg-purple-700/8 blur-[150px] rounded-full" />
                <div className="absolute bottom-0 right-[10%] w-[500px] h-[500px] bg-fuchsia-700/6 blur-[150px] rounded-full" />
            </div>

            <AdminSidebar user={user} />
            <div className="flex-1 overflow-x-hidden relative z-10 w-full">
                {children}
            </div>
        </div>
    );
}
