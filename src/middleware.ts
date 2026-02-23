import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 認証が必要なページのパス一覧
const protectedPaths = ["/products/create", "/products/edit", "/mypage"];

export function middleware(req: NextRequest) {
    const token = req.cookies.get('laravel_session'); // Sanctum セッションCookie
    const { pathname } = req.nextUrl;

    // 未ログインで /products/create に来たら /login に飛ばす
    // if (!token && req.nextUrl.pathname.startsWith('/products/create')) {
    if (protectedPaths.some((path) => pathname.startsWith(path)) && !token) {
        const loginUrl = new URL('/login', req.url);
        // loginUrl.searchParams.set('redirect', req.nextUrl.pathname);
        loginUrl.searchParams.set("redirect", pathname); // ← ここで付与
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}
