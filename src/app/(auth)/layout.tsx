export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#0f1021] flex items-center justify-center relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-600/20 blur-[120px] rounded-full" />
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
            </div>
            {children}
        </div>
    );
}
