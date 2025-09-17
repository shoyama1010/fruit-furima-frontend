"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileEditPage() {
    const [form, setForm] = useState({
        name: "",
        postcode: "",
        address: "",
        phone: "",
        img_url: null as File | null,
    });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // 初期ロードでプロフィール取得
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("ログインしてください");
            router.push("/login");
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch("http://localhost/api/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                if (!res.ok) throw new Error("プロフィール取得失敗");

                const data = await res.json();
                setForm({
                    name: data.name || "",
                    postcode: data.postcode || "",
                    address: data.address || "",
                    phone: data.phone || "",
                    img_url: null,
                });
            } catch (err) {
                console.error(err);
                alert("プロフィール情報を取得できませんでした");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    // 更新処理
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            alert("ログインしてください");
            return;
        }

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("postcode", form.postcode);
        formData.append("address", form.address);
        formData.append("phone", form.phone);
        if (form.img_url) {
            formData.append("img_url", form.img_url);
        }

        try {
            const res = await fetch("http://localhost/api/profile", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    postcode: form.postcode,
                    address: form.address,
                    phone_number: form.phone, // ← DBと一致させる
                })
                // body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                alert("更新失敗: " + (data.message || "不明なエラー"));
                return;
            }

            alert("プロフィール更新成功！");
            router.push("/profile"); // 更新後にプロフィール画面へ戻す
        } catch (err) {
            console.error(err);
            alert("通信エラーが発生しました");
        }
    };

    if (loading) return <p className="p-6">読み込み中...</p>;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">プロフィール設定</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* プロフィール画像 */}
                    <div className="flex flex-col items-center">
                        <label className="text-sm text-gray-600 mb-2">プロフィール画像</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setForm({ ...form, img_url: e.target.files ? e.target.files[0] : null })
                            }
                        />
                    </div>

                    {/* ユーザー名 */}
                    <div>
                        <label className="block text-sm font-medium mb-1">ユーザー名</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    {/* 郵便番号 */}
                    <div>
                        <label className="block text-sm font-medium mb-1">郵便番号</label>
                        <input
                            type="text"
                            value={form.postcode}
                            onChange={(e) => setForm({ ...form, postcode: e.target.value })}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    {/* 住所 */}
                    <div>
                        <label className="block text-sm font-medium mb-1">住所</label>
                        <input
                            type="text"
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    {/* 電話番号 */}
                    <div>
                        <label className="block text-sm font-medium mb-1">電話番号</label>
                        <input
                            type="text"
                            name="phone_number"  // ← 追加・・・これが重要！
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                    >
                        更新する
                    </button>
                </form>
            </div>
        </div>
    );
}
