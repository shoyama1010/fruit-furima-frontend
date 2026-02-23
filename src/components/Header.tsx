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

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("http://localhost/api/user", {
                    credentials: "include",
                });

                if (!res.ok) {
                    setUser(null);
                } else {
                    const data = await res.json();
                    setUser(data);
                }
            } catch (err) {
                console.error(err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) return null;

    return (
        <header className="bg-white shadow">
            <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
                <Link href="/products" className="text-2xl font-bold text-orange-500">
                    mogitate
                </Link>

                <nav className="flex items-center space-x-6 text-sm">
                    {user ? (
                        <>
                            <span className="text-gray-600">
                                ようこそ、{user.name} さん
                            </span>

                            <Link href="/profile" className="hover:text-orange-500">
                                マイページ
                            </Link>

                            <button
                                onClick={async () => {
                                    await fetch("http://localhost/api/logout", {
                                        method: "POST",
                                        credentials: "include",
                                    });
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