import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get('access_token')?.value;

    const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup');

    const protectedRoutes = ['/dashboard', '/subscriptions', '/settings', '/calendar', '/notifications']
    const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))

    if (!token && isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', req.url))
    }
 
    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next();
}


export const config = {
    matcher: [
        '/dashboard/:path*',
        '/subscriptions/:path*',
        '/settings/:path*',
        '/notifications/:path*',
        '/calendar/:path*',
        '/login',
        '/signup'
    ]
}