import type { NextAuthConfig ,Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { jwtDecode } from 'jwt-decode'

type DRFAuthResponse = { access: string; refresh: string; is_first_login: boolean };
type AccessPayload    = { user_id: number; username: string; exp: number; email?: string };

const API_URL = process.env.API_URL!;

async function refreshAccessToken(token: JWT): Promise<JWT> {
    const res = await fetch(`${API_URL}/api/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: token.refreshToken }),
        cache: 'no-store',
    });

    if (!res.ok) {
        return { ...token, error: 'RefreshAccessTokenError' };
    }

    const data = (await res.json()) as DRFAuthResponse;
    const decoded = jwtDecode<AccessPayload>(data.access);

    return {
        ...token,
        accessToken: data.access,
        refreshToken: data.refresh,
        accessTokenExpires: decoded.exp * 1000,
        error: undefined,
    };
}

export const authOptions: NextAuthConfig = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials): Promise<User | null> {
                if (!credentials) return null;

                console.log('credentials', credentials);
                console.log('path', `${API_URL}/api/token/`)
                const res = await fetch(`${API_URL}api/token/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: credentials.username,
                        password: credentials.password,
                    }),
                });
                console.log('response' ,res);
                if (!res.ok) return null;
                const data = (await res.json()) as DRFAuthResponse;
                console.log('response data', data);
                const payload = jwtDecode<AccessPayload>(data.access);

                return {
                    id: String(payload.user_id),
                    name: payload.username,
                    email: payload.email,
                    accessToken: data.access,
                    refreshToken: data.refresh,
                    accessTokenExpires: payload.exp * 1000,
                    authority: [],
                    isFirstLogin: data.is_first_login
                };
            },
        }),
    ],

    session: { strategy: 'jwt' },

    callbacks: {
        async jwt({ token, user }): Promise<JWT> {
            if (user) {
                return {
                    ...token,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    accessTokenExpires: user.accessTokenExpires,
                    id: String(user.id),
                    isFirstLogin: user.isFirstLogin
                };
            }
            if (Date.now() < token.accessTokenExpires) {
                return token;
            }
            return await refreshAccessToken(token);
        },

        async session({ session, token }): Promise<Session> {
            session.user.id= String(token.id);
            session.accessToken= token.accessToken;
            session.error= token.error;
            session.user.isFirstLogin = token.isFirstLogin;
            return session;
        },
    },

    pages: {
        signIn: '/auth/sign-in',
    },
    logger: {
        error(code, ...message) {
            console.error(code, message)
        },
        warn(code, ...message) {
            console.warn(code, message)
        },
        debug(code, ...message) {
            console.debug(code, message)
        }
    },

    secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
