
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const res = await fetch("http://localhost/api/user", {
                credentials: "include",
            });

            if (!res.ok) {
                router.replace("/login");
                return;
            }

            const data = await res.json();
            setUser(data);
        };

        checkAuth();
    }, []);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h1>ダッシュボード</h1>
            <p>ようこそ {user.name}</p>
        </div>
    );
}