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

type ApiResponse = {
    message?: string;
    errors?: ValidationErrors;
    name?: string | null;
    postcode?: string | null;
    address?: string | null;
    phone_number?: string | null;
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
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        const fetchProfile = async () => {
            setGeneralError("");

            if (!API_BASE_URL) {
                setGeneralError("APIのURLが設定されていません。");
                setLoading(false);
                return;
            }

            const token = localStorage.getItem("auth_token");

            if (!token) {
                router.replace("/login");
                return;
            }

            try {
                // ログインユーザー確認
                const userRes = await fetch(`${API_BASE_URL}/api/user`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (userRes.status === 401) {
                    localStorage.removeItem("auth_token");
                    router.replace("/login");
                    return;
                }

                if (!userRes.ok) {
                    throw new Error("ログインユーザー取得失敗");
                }

                // プロフィール取得
                const profileRes = await fetch(
                    `${API_BASE_URL}/api/profile`,
                    {
                        method: "GET",
                        cache: "no-store",
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (profileRes.status === 401) {
                    localStorage.removeItem("auth_token");
                    router.replace("/login");
                    return;
                }

                if (!profileRes.ok) {
                    throw new Error("プロフィール取得失敗");
                }

                const data: ApiResponse = await profileRes.json();

                setForm({
                    name: data.name ?? "",
                    postcode: data.postcode ?? "",
                    address: data.address ?? "",
                    phone_number: data.phone_number ?? "",
                    img_url: null,
                });
            } catch (error) {
                console.error("プロフィール取得エラー:", error);
                setGeneralError(
                    "プロフィール情報を取得できませんでした。"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [API_BASE_URL, router]);

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

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
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

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setSubmitting(true);
        setErrors({});
        setGeneralError("");
        setSuccessMessage("");

        if (!API_BASE_URL) {
            setGeneralError("APIのURLが設定されていません。");
            setSubmitting(false);
            return;
        }

        const token = localStorage.getItem("auth_token");

        if (!token) {
            router.replace("/login");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("name", form.name);
            formData.append("postcode", form.postcode);
            formData.append("address", form.address);
            formData.append("phone_number", form.phone_number);

            if (form.img_url) {
                formData.append("img_url", form.img_url);
            }

            // Laravel側のPUTルートへ、POST + _methodで送信
            formData.append("_method", "PUT");

            const res = await fetch(
                `${API_BASE_URL}/api/profile`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data: ApiResponse = await res
                .json()
                .catch(() => ({}));

            if (res.status === 401) {
                localStorage.removeItem("auth_token");
                router.replace("/login");
                return;
            }

            if (res.status === 422) {
                setErrors(data.errors ?? {});
                return;
            }

            if (!res.ok) {
                setGeneralError(
                    data.message ??
                    "プロフィール更新に失敗しました。"
                );
                return;
            }

            setSuccessMessage("プロフィールを更新しました。");

            window.setTimeout(() => {
                router.push("/profile");
                router.refresh();
            }, 800);
        } catch (error) {
            console.error("プロフィール更新エラー:", error);
            setGeneralError("通信エラーが発生しました。");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <p className="p-6">読み込み中...</p>;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md rounded bg-white p-8 shadow-md">
                <h1 className="mb-6 text-center text-2xl font-bold">
                    プロフィール設定
                </h1>

                {successMessage && (
                    <div className="mb-4 rounded border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {successMessage}
                    </div>
                )}

                {generalError && (
                    <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {generalError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col items-center">
                        <label className="mb-2 text-sm text-gray-600">
                            プロフィール画像
                        </label>

                        <label
                            htmlFor="profile-image"
                            className="inline-block cursor-pointer rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
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
                            {form.img_url
                                ? form.img_url.name
                                : "選択されていません"}
                        </p>

                        {errors.img_url && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.img_url[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            ユーザー名
                        </label>

                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) =>
                                handleChange("name", e.target.value)
                            }
                            className="w-full rounded border px-3 py-2"
                        />

                        {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.name[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            郵便番号
                        </label>

                        <input
                            type="text"
                            value={form.postcode}
                            onChange={(e) =>
                                handleChange("postcode", e.target.value)
                            }
                            className="w-full rounded border px-3 py-2"
                            placeholder="例: 7940010"
                        />

                        {errors.postcode && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.postcode[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            住所
                        </label>

                        <input
                            type="text"
                            value={form.address}
                            onChange={(e) =>
                                handleChange("address", e.target.value)
                            }
                            className="w-full rounded border px-3 py-2"
                        />

                        {errors.address && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.address[0]}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            電話番号
                        </label>

                        <input
                            type="text"
                            value={form.phone_number}
                            onChange={(e) =>
                                handleChange(
                                    "phone_number",
                                    e.target.value
                                )
                            }
                            className="w-full rounded border px-3 py-2"
                            placeholder="例: 08012345678"
                        />

                        {errors.phone_number && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.phone_number[0]}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => router.push("/profile")}
                            disabled={submitting}
                            className="w-1/2 rounded bg-gray-400 py-2 text-white hover:bg-gray-500 disabled:opacity-60"
                        >
                            戻る
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-1/2 rounded bg-red-500 py-2 text-white hover:bg-red-600 disabled:opacity-60"
                        >
                            {submitting ? "更新中..." : "更新する"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

