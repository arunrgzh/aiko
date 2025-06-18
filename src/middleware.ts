import { NextResponse } from 'next/server'
import NextAuth from 'next-auth'
import authConfig from '@/configs/auth.config'
import {
    authRoutes as _authRoutes,
    // publicRoutes as _publicRoutes
} from '@/configs/routes.config'
// import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import appConfig from '@/configs/app.config'

const { auth } = NextAuth(authConfig)

// const publicRoutes = Object.keys(_publicRoutes)
const authRoutes = Object.keys(_authRoutes)
const apiAuthPath = `${appConfig.apiPrefix}/auth`

export default auth((req) => {
    const { nextUrl } = req
    const pathname = nextUrl.pathname

    if (pathname.startsWith(apiAuthPath)) return

    const isSignedIn = Boolean(req.auth?.accessToken)
    console.log('is signed in', isSignedIn)
    // const isPublic = publicRoutes.includes(pathname)
    const isAuthPage = authRoutes.includes(pathname)

    if (isAuthPage && isSignedIn) {
        return NextResponse.redirect(
            new URL(appConfig.authenticatedEntryPath, nextUrl),
        )
    }

    // if (!isSignedIn && !isPublic) {
    //     const callback = `${pathname}${nextUrl.search}`
    //     const redirectUrl = new URL(
    //         `${appConfig.unAuthenticatedEntryPath}?${REDIRECT_URL_KEY}=${encodeURIComponent(callback)}`,
    //         nextUrl
    //     )
    //     return NextResponse.redirect(redirectUrl)
    // }

    return
})

export const config = {
    matcher: ['/((?!.+\.[\\w]+$|_next).*)', '/', '/(api)(.*)'],
}
