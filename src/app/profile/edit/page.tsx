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

type ValidationErrors = {
    name?: string[];
    postcode?: string[];
    address?: string[];
    phone_number?: string[];
    img_url?: string[];
};

export default function ProfileEditPage() {
    const [form, setForm] = useState<ProfileForm>({
        name: "",
        postcode: "",
        address: "",
        phone_number: "",
        img_url: null,
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [generalError, setGeneralError] = useState("");

    const router = useRouter();
  
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userRes = await fetch("http://localhost/api/user", {
                    credentials: "include",
                });

                if (!userRes.ok) {
                    alert("ログインしてください");
                    router.push("/login");
                    return;
                }

                const res = await fetch("http://localhost/api/profile", {
                    credentials: "include",
                    cache: "no-store",
                });

                if (!res.ok) throw new Error("プロフィール取得失敗");

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

    const handleChange = (
        key: keyof Omit<ProfileForm, "img_url">,
        value: string
    ) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [key]: undefined,
        }));

        setGeneralError("");
        setSuccessMessage("");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({
            ...prev,
            img_url: e.target.files?.[0] ?? null,
        }));

        setErrors((prev) => ({
            ...prev,
            img_url: undefined,
        }));

        setGeneralError("");
        setSuccessMessage("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});
        setGeneralError("");
        setSuccessMessage("");

        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("postcode", form.postcode);
            formData.append("address", form.address);
            formData.append("phone_number", form.phone_number);

            if (form.img_url) {
                formData.append("img_url", form.img_url);
            }

            formData.append("_method", "PUT");

            const res = await fetch("http://localhost/api/profile", {
                method: "POST",
                credentials: "include",
                headers: {
                    Accept: "application/json",
                },
                body: formData,
            });

            const data = await res.json();

            if (res.status === 422) {
                setErrors(data.errors || {});
                return;
            }

            if (!res.ok) {
                setGeneralError(data.message || "プロフィール更新に失敗しました");
                // alert(data.message || "プロフィール更新に失敗しました");
                return;
            }
            // alert("プロフィールを更新しました");
            setSuccessMessage("プロフィールを更新しました");
            setTimeout(() => {
                router.push("/profile");
            }, 800)
            // router.push("/profile");
        } catch (err) {
            console.error(err);
            // alert("通信エラーが発生しました");
            setGeneralError("通信エラーが発生しました");
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
                        <label className="text-sm text-gray-600 mb-2">プロフィール画像</label>

                        <label
                            htmlFor="profile-image"
                            className="inline-block bg-gray-200 px-4 py-2 rounded cursor-pointer hover:bg-gray-300"
                        >
                            画像を選択
                        </label>

                        <input
                            id="profile-image"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        <p className="mt-2 text-sm text-gray-500">
                            {form.img_url ? form.img_url.name : "選択されていません"}
                        </p>

                        {errors.img_url && (
                            <p className="text-red-500 text-sm mt-1">{errors.img_url[0]}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">ユーザー名</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">郵便番号</label>
                        <input
                            type="text"
                            value={form.postcode}
                            onChange={(e) => handleChange("postcode", e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="例: 7940010"
                        />
                        {errors.postcode && (
                            <p className="text-red-500 text-sm mt-1">{errors.postcode[0]}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">住所</label>
                        <input
                            type="text"
                            value={form.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.address && (
                            <p className="text-red-500 text-sm mt-1">{errors.address[0]}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">電話番号</label>
                        <input
                            type="text"
                            value={form.phone_number}
                            onChange={(e) => handleChange("phone_number", e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="例: 08012345678"
                        />
                        {errors.phone_number && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.phone_number[0]}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => router.push("/profile")}
                            className="w-1/2 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
                        >
                            戻る
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-1/2 bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:opacity-60"
                        >
                            {submitting ? "更新中..." : "更新する"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

