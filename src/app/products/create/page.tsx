// src/app/products/create/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface ProductFormData {
    name: string;
    price: number;
    description: string;
    seasons: string[];
    image: FileList;
}

interface ApiErrorResponse {
    message?: string;
    errors?: Record<string, string[]>;
}

export default function ProductCreatePage() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ProductFormData>();

    const [preview, setPreview] = useState<string | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    // ログイン確認
    useEffect(() => {
        const checkLogin = async () => {
            if (!API_BASE_URL) {
                console.error("APIのURLが設定されていません");
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

                if (!res.ok) {
                    localStorage.removeItem("auth_token");
                    router.replace("/login");
                    return;
                }
            } catch (error) {
                console.error("ログイン確認エラー:", error);
                router.replace("/login");
            } finally {
                setAuthLoading(false);
            }
        };

        checkLogin();
    }, [API_BASE_URL, router]);

    // 画像プレビュー
    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) {
            setPreview(null);
            return;
        }

        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setPreview(URL.createObjectURL(file));
    };

    // プレビューURLの後片付け
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    // 商品登録
    const onSubmit = async (data: ProductFormData) => {
        setErrorMessage("");

        if (!API_BASE_URL) {
            setErrorMessage("APIのURLが設定されていません。");
            return;
        }

        const token = localStorage.getItem("auth_token");

        if (!token) {
            router.replace("/login");
            return;
        }

        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("price", String(data.price));
        formData.append("description", data.description);

        if (data.image?.[0]) {
            formData.append("image", data.image[0]);
        }

        data.seasons?.forEach((seasonId) => {
            formData.append("seasons[]", seasonId);
        });

        try {
            const res = await fetch(`${API_BASE_URL}/api/products`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const responseData: ApiErrorResponse = await res
                .json()
                .catch(() => ({}));

            if (res.status === 401) {
                localStorage.removeItem("auth_token");
                router.replace("/login");
                return;
            }

            if (res.status === 422) {
                const validationMessages = responseData.errors
                    ? Object.values(responseData.errors).flat().join("\n")
                    : "入力内容を確認してください。";

                setErrorMessage(validationMessages);
                return;
            }

            if (!res.ok) {
                setErrorMessage(
                    responseData.message ?? "商品登録に失敗しました。"
                );
                return;
            }

            alert("商品を登録しました！");
            router.push("/products");
            router.refresh();
        } catch (error) {
            console.error("商品登録エラー:", error);
            setErrorMessage("通信エラーが発生しました。");
        }
    };

    if (authLoading) {
        return <div className="text-center mt-10">ログイン確認中...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
            <h2 className="text-2xl font-bold text-center mb-6">
                商品登録
            </h2>

            {errorMessage && (
                <div className="mb-6 rounded border border-red-300 bg-red-50 p-3 text-red-600 whitespace-pre-line">
                    {errorMessage}
                </div>
            )}

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
            >
                {/* 商品名 */}
                <div>
                    <label className="block font-semibold">
                        商品名
                        <span className="text-red-500"> 必須</span>
                    </label>

                    <input
                        type="text"
                        {...register("name", {
                            required: "商品名は必須です",
                        })}
                        className={`w-full border rounded p-2 ${errors.name
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                    />

                    {errors.name && (
                        <p className="text-red-500 text-sm">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                {/* 値段 */}
                <div>
                    <label className="block font-semibold">
                        値段
                        <span className="text-red-500"> 必須</span>
                    </label>

                    <input
                        type="number"
                        {...register("price", {
                            required: "値段は必須です",
                            valueAsNumber: true,
                            min: {
                                value: 1,
                                message: "値段は1円以上で入力してください",
                            },
                        })}
                        className={`w-full border rounded p-2 ${errors.price
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                    />

                    {errors.price && (
                        <p className="text-red-500 text-sm">
                            {errors.price.message}
                        </p>
                    )}
                </div>

                {/* 商品画像 */}
                <div>
                    <label className="block font-semibold">
                        商品画像
                        <span className="text-red-500"> 必須</span>
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        {...register("image", {
                            required: "商品画像は必須です",
                        })}
                        onChange={handleImageChange}
                        className="block mt-1"
                    />

                    {errors.image && (
                        <p className="text-red-500 text-sm">
                            {errors.image.message}
                        </p>
                    )}

                    {preview && (
                        <Image
                            src={preview}
                            alt="プレビュー"
                            width={192}
                            height={192}
                            unoptimized
                            className="mt-3 w-48 h-48 rounded shadow object-cover"
                        />
                    )}
                </div>

                {/* 季節 */}
                <div>
                    <label className="block font-semibold">
                        季節
                        <span className="text-red-500"> 必須</span>
                    </label>

                    <div className="flex gap-4 mt-2">
                        {["春", "夏", "秋", "冬"].map(
                            (season, index) => (
                                <label
                                    key={season}
                                    className="flex items-center gap-1"
                                >
                                    <input
                                        type="checkbox"
                                        value={String(index + 1)}
                                        {...register("seasons", {
                                            required:
                                                "季節は必須です",
                                        })}
                                    />
                                    {season}
                                </label>
                            )
                        )}
                    </div>

                    {errors.seasons && (
                        <p className="text-red-500 text-sm">
                            {errors.seasons.message}
                        </p>
                    )}
                </div>

                {/* 商品説明 */}
                <div>
                    <label className="block font-semibold">
                        商品説明
                        <span className="text-red-500"> 必須</span>
                    </label>

                    <textarea
                        rows={4}
                        {...register("description", {
                            required: "商品説明は必須です",
                        })}
                        className={`w-full border rounded p-2 ${errors.description
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                    />

                    {errors.description && (
                        <p className="text-red-500 text-sm">
                            {errors.description.message}
                        </p>
                    )}
                </div>

                {/* ボタン */}
                <div className="flex justify-center gap-6 mt-6">
                    <button
                        type="button"
                        onClick={() => router.push("/products")}
                        className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
                    >
                        戻る
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-yellow-400 text-white px-6 py-2 rounded hover:bg-yellow-500 disabled:opacity-50"
                    >
                        {isSubmitting ? "登録中..." : "登録"}
                    </button>
                </div>
            </form>
        </div>
    );
}