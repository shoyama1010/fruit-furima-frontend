"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// ✅ Cookie を取得する関数を追加（コンポーネント外に置く）
function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()!.split(";").shift();
    }
}

export default function LoginPage() {
    const router = useRouter();

    const searchParams = useSearchParams(); // ← redirect パラメータを取る
    const redirect = searchParams.get("redirect") || "/products"; // 無ければ /products
    const [form, setForm] = useState({ email: "", password: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // ✅ CSRF Cookie を先に取得
            await fetch("http://localhost/sanctum/csrf-cookie", {
                // method: "GET",
                credentials: "include",
            });

            // ✅ ② XSRFトークン取得
            const xsrfToken = getCookie("XSRF-TOKEN");

            // ✅ ログインAPIを呼ぶ
            const res = await fetch("http://localhost/api/login", {
                method: "POST",
                credentials: "include", // ← Cookie を保持 (Sanctum必須)
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    // ↓追加
                    "X-XSRF-TOKEN": decodeURIComponent(xsrfToken || ""),
                },
                 
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) {
                alert("ログイン失敗: " + (data.message || "不明なエラー"));
                return;
            }

            const userRes = await fetch("http://localhost/api/user", {
                credentials: "include",
            });

            // const userData = await userRes.json();
            if (userRes.ok) {
                alert("ログイン成功");
                router.push(redirect); // リダイレクト処理
            } else {
                alert("ユーザー情報取得失敗");
            }

        } catch (error) {
            console.error("Login error:", error);
            alert("通信エラーが発生しました");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md w-96"
            >
                <h1 className="text-2xl font-bold mb-6 text-center">ログイン</h1>
                <input
                    type="email"
                    placeholder="メールアドレス"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full p-2 mb-4 border rounded"
                />
                <input
                    type="password"
                    placeholder="パスワード"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full p-2 mb-4 border rounded"
                />
                <button
                    type="submit"
                    className="w-full py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
                >
                    ログイン
                </button>
            </form>
        </div>
    );
}