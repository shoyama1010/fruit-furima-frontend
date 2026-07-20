"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!API_BASE_URL) {
            alert("APIのURLが設定されていません");
            return;
        }

        try {
            // ① メールアドレスとパスワードでログイン
            const loginRes = await fetch(`${API_BASE_URL}/api/login`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const loginData = await loginRes.json().catch(() => null);

            if (!loginRes.ok) {
                console.error("ログイン失敗", {
                    status: loginRes.status,
                    data: loginData,
                });

                alert(
                    `ログイン失敗: ${loginData?.message ?? `HTTP ${loginRes.status}`
                    }`
                );
                return;
            }

            if (!loginData?.token) {
                console.error("トークンが返されていません", loginData);
                alert("ログイン情報の取得に失敗しました");
                return;
            }

            // ② Sanctumトークンをブラウザに保存
            localStorage.setItem("auth_token", loginData.token);

            // ③ 保存したトークンでログインユーザーを取得
            const userRes = await fetch(`${API_BASE_URL}/api/user`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${loginData.token}`,
                },
            });

            const userData = await userRes.json().catch(() => null);

            if (!userRes.ok) {
                localStorage.removeItem("auth_token");

                console.error("ユーザー情報取得失敗", {
                    status: userRes.status,
                    data: userData,
                });

                alert(
                    `ユーザー情報取得失敗: ${userData?.message ?? `HTTP ${userRes.status}`
                    }`
                );
                return;
            }

            console.log("ログインユーザー:", userData);

            alert("ログイン成功");
            window.location.href = "/products";
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