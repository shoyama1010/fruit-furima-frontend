"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const [email, setEmail] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // 🎯 localStorage から token を取得
        const token = localStorage.getItem("token");
        if (!token) {
            alert("ログインしてください");
            router.push("/login");
            return;
        }

        // ダミーで email を保存（実際は API から取得しても良い）
        const savedEmail = localStorage.getItem("userEmail");
        if (savedEmail) {
            setEmail(savedEmail);
        }
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">ダッシュボード</h1>
            {email ? (
                <p>ようこそ <span className="font-semibold">{email}</span> さん！</p>
            ) : (
                <p>ログイン済みです。</p>
            )}

            {/* マイページボタン */}
            <button
                onClick={() => router.push("/profile")}
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                マイページへ
            </button>
        </div>
    );
}
