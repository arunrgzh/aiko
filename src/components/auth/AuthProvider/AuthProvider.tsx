'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import SessionContext from './SessionContext';
import type { ReactNode } from 'react';

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    return (
        <SessionProvider>
            <SessionWatcher>{children}</SessionWatcher>
        </SessionProvider>
    );
}

function SessionWatcher({ children }: { children: ReactNode }) {
    const { data: session } = useSession();
    return (
        <SessionContext.Provider value={session ?? null}>
            {children}
        </SessionContext.Provider>
    );
}


export default AuthProvider
