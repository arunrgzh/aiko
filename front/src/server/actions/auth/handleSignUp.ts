'use server'

import type { SignUpCredential } from '@/@types/auth'

export const onSignUpWithCredentials = async (
    { email, username }: SignUpCredential,
) => {
    try {
        /** Pretend create user */
        return {
            email,
            username,
            id: username,
        }
    } catch (error) {
        throw error
    }
}
