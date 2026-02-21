import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db/mongodb';
import User from '@/models/User';

export const authConfig: NextAuthConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as { role?: string }).role;
                token.username = (user as { username?: string }).username;
                token.accountStatus = (user as any).accountStatus;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                (session.user as { role?: string }).role = token.role as string;
                (session.user as { username?: string }).username = token.username as string;
                (session.user as any).accountStatus = token.accountStatus;
            }
            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');

            if (isOnAdmin) {
                if (isLoggedIn && (auth?.user as { role?: string })?.role === 'admin') return true;
                return false;
            }

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false;
            }

            return true;
        },
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const { email, password } = credentials as { email: string; password: string };

                if (!email || !password) return null;

                try {
                    await connectDB();
                    const user = await User.findOne({ email: email.toLowerCase() });

                    if (!user) return null;

                    const passwordMatch = await bcrypt.compare(password, user.password);
                    if (!passwordMatch) return null;

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        username: user.username,
                        role: user.role,
                        name: user.username,
                        accountStatus: user.accountStatus,
                    };
                } catch (error) {
                    console.error('Auth error:', error);
                    return null;
                }
            },
        }),
    ],
};
