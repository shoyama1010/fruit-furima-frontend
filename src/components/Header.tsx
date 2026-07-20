"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
    id: number;
    name: string;
}

export default function Header() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("auth_token");

            // トークンがない場合は未ログイン表示
            if (!token || !API_BASE_URL) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${API_BASE_URL}/api/user`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    localStorage.removeItem("auth_token");
                    setUser(null);
                    return;
                }

                const data: User = await res.json();
                setUser(data);
            } catch (err) {
                console.error("ユーザー情報取得エラー:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [API_BASE_URL]);

    const handleLogout = async () => {
        const token = localStorage.getItem("auth_token");

        try {
            if (token && API_BASE_URL) {
                await fetch(`${API_BASE_URL}/api/logout`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
        } catch (err) {
            console.error("ログアウトエラー:", err);
        } finally {
            localStorage.removeItem("auth_token");
            setUser(null);
            window.location.href = "/login";
        }
    };

    if (loading) return null;

    return (
        <header className="bg-white shadow">
            <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
                <Link
                    href="/products"
                    className="text-2xl font-bold text-orange-500"
                >
                    mogitate
                </Link>

                <nav className="flex items-center space-x-6 text-sm">
                    {user ? (
                        <>
                            <span className="text-gray-600">
                                ようこそ、{user.name} さん
                            </span>

                            <Link
                                href="/profile"
                                className="hover:text-orange-500"
                            >
                                プロフィール
                            </Link>

                            <Link
                                href="/mypage"
                                className="hover:text-orange-500"
                            >
                                マイページ
                            </Link>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="hover:text-orange-500"
                            >
                                ログアウト
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="hover:text-orange-500"
                            >
                                ログイン
                            </Link>

                            <Link
                                href="/register"
                                className="hover:text-orange-500"
                            >
                                会員登録
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}