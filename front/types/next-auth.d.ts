// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
    interface User extends DefaultUser {
        id?: string;
        accessToken?: string;
        refreshToken?: string;
        accessTokenExpires: number;
        authority?: string[];
        isFirstLogin?: boolean;
    }

    interface Session {
        user: {
            name?: string | null;
            email?: string | null;
            image?: string | null;
            authority?: string[];
            isFirstLogin?: boolean;
        } & DefaultSession['user'];
        accessToken?: string;
        error?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        id?: string;
        accessToken?: string;
        refreshToken?: string;
        accessTokenExpires: number;
        authority?: string[];
        error?: string;
        isFirstLogin?: boolean;
    }
}
