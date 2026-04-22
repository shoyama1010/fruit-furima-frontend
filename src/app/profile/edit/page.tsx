"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ProfileForm = {
    name: string;
    postcode: string;
    address: string;
    phone_number: string;
    img_url: File | null;
};

export default function ProfileEditPage() {
    const [form, setForm] = useState<ProfileForm>({
        name: "",
        postcode: "",
        address: "",
        phone_number: "",
        img_url: null,
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // ログイン確認
                const userRes = await fetch("http://localhost/api/user", {
                    credentials: "include",
                });

                if (!userRes.ok) {
                    alert("ログインしてください");
                    router.push("/login");
                    return;
                }

                // プロフィール取得
                const res = await fetch("http://localhost/api/profile", {
                    credentials: "include",
                });

                if (!res.ok) {
                    throw new Error("プロフィール取得失敗");
                }

                const data = await res.json();

                setForm({
                    name: data.name ?? "",
                    postcode: data.postcode ?? "",
                    address: data.address ?? "",
                    phone_number: data.phone_number ?? "",
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

    const handleChange = (key: keyof Omit<ProfileForm, "img_url">, value: string) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({
            ...prev,
            img_url: e.target.files?.[0] ?? null,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("postcode", form.postcode);
            formData.append("address", form.address);
            formData.append("phone_number", form.phone_number);

            if (form.img_url) {
                formData.append("img_url", form.img_url);
            }

            // Laravel 側を PUT ルートにしている場合の method spoofing
            formData.append("_method", "PUT");

            const res = await fetch("http://localhost/api/profile", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                alert("更新失敗: " + (data.message || "不明なエラー"));
                return;
            }

            alert("プロフィールを更新しました");
            router.push("/profile");
        } catch (err) {
            console.error(err);
            alert("通信エラーが発生しました");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <p className="p-6">読み込み中...</p>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">プロフィール設定</h1>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="flex flex-col items-center">
                        <label htmlFor="profile-image" className="text-sm text-gray-600 mb-2">プロフィール画像</label>

                        <input id="profile-image"
                            type="file"
                            accept="image/*" onChange={handleFileChange} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">ユーザー名</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">郵便番号</label>
                        <input
                            type="text"
                            value={form.postcode}
                            onChange={(e) => handleChange("postcode", e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">住所</label>
                        <input
                            type="text"
                            value={form.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">電話番号</label>
                        <input
                            type="text"
                            value={form.phone_number}
                            onChange={(e) => handleChange("phone_number", e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:opacity-60"
                    >
                        {submitting ? "更新中..." : "更新する"}
                    </button>
                </form>
            </div>
        </div>
    );
}