"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
    id: number;
    name: string;
    email: string;
};

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        const checkAuth = async () => {
            if (!API_BASE_URL) {
                router.replace("/login");
                return;
            }

            const token = localStorage.getItem("auth_token");

            if (!token) {
                router.replace("/login");
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

                if (res.status === 401) {
                    localStorage.removeItem("auth_token");
                    router.replace("/login");
                    return;
                }

                if (!res.ok) {
                    throw new Error("ユーザー取得失敗");
                }

                const data: User = await res.json();
                setUser(data);
            } catch (error) {
                console.error(error);
                localStorage.removeItem("auth_token");
                router.replace("/login");
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [API_BASE_URL, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">ダッシュボード</h1>

            <p className="mt-4">
                ようこそ {user.name} さん
            </p>
        </div>
    );
}