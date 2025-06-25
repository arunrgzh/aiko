import { useContext } from 'react';
import SessionContext from '@/components/auth/AuthProvider/SessionContext'
import type { Session } from 'next-auth';

export default function useCurrentSession(): {session: Session} {
    const context=  useContext(SessionContext);
    return {
        session: context || {
            expires: '',
            user: {
                id: '',
                name: null,
                email: null,
                image: null,
                accessToken: '',
                refreshToken: '',
                accessTokenExpires: 0,
                authority: [],
            },
        }
    }
};

