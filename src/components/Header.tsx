"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
    // ログイン状態（例: localStorage にトークンがあるかどうかで判定）
    // const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("token");
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        // ここでログイン状態を確認（例: localStorage や Cookie）
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    if (isLoggedIn === null) {
        // SSR と CSR の不一致を防ぐため、初期描画では何も表示しない
        return null;
    }

    return (
        <header className="bg-white shadow">
            <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
                {/* 左：ロゴ */}
                <Link href="/" className="text-2xl font-bold text-orange-500">
                    mogitate
                </Link>

                {/* 右：ナビゲーションボタン */}
                <nav className="flex space-x-6 text-sm">
                    {isLoggedIn ? (
                        <>
                            <Link href="/profile" className="hover:text-orange-500">
                                マイページ
                            </Link>
                            <button
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("userEmail");
                                    window.location.href = "/login";
                                }}
                                className="hover:text-orange-500"
                            >
                                ログアウト
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hover:text-orange-500">
                                ログイン
                            </Link>
                            <Link href="/register" className="hover:text-orange-500">
                                会員登録
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
