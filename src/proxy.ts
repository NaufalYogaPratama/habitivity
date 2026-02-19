import { auth } from '@/auth';
import { NextResponse, NextRequest } from 'next/server';

export default auth((req) => {
    // Lakukan casting ke NextRequest agar nextUrl dikenali oleh TS
    const { nextUrl } = req as unknown as NextRequest;

    const isLoggedIn = !!req.auth;
    const userRole = (req.auth?.user as { role?: string })?.role;

    const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
    const isOnAdmin = nextUrl.pathname.startsWith('/admin');
    const isOnAuth = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');

    // Redirect user yang sudah login dari halaman auth
    if (isLoggedIn && isOnAuth) {
        if (userRole === 'admin') {
            return NextResponse.redirect(new URL('/admin/dashboard', nextUrl));
        }
        return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }

    // Proteksi rute dashboard (User/Admin)
    if (isOnDashboard && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', nextUrl));
    }

    // Proteksi rute admin (Hanya Admin)
    if (isOnAdmin) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL('/login', nextUrl));
        }
        if (userRole !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', nextUrl));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
    ],
};