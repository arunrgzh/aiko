import { NextResponse } from 'next/server'
import NextAuth from 'next-auth'
import authConfig from '@/configs/auth.config'
import { authRoutes as _authRoutes } from '@/configs/routes.config/routes.config'
import appConfig from '@/configs/app.config'

const { auth } = NextAuth(authConfig)

const authRoutes = Object.keys(_authRoutes)

// Routes that definitely don't need auth checking
const staticPaths = [
    '/_next',
    '/api/auth', // NextAuth handles its own auth
    '/favicon.ico',
    '/public',
    '/static',
    '/images',
    '/img',
    '/css',
    '/js',
]

export default auth((req) => {
    const { nextUrl } = req
    const pathname = nextUrl.pathname

    // Skip auth for static paths and API auth routes
    if (staticPaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.next()
    }

    const isSignedIn = Boolean(req.auth?.accessToken)
    const isAuthPage = authRoutes.includes(pathname)

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isSignedIn) {
        return NextResponse.redirect(
            new URL(appConfig.authenticatedEntryPath, nextUrl),
        )
    }

    return NextResponse.next()
})

export const config = {
    // More specific matcher to reduce unnecessary middleware runs
    matcher: [
        // Auth pages that need redirect logic
        '/sign-in',
        '/sign-up',
        '/forgot-password',
        '/reset-password',
        // Skip all static files, _next, and api routes except specific ones
        '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    ],
}
