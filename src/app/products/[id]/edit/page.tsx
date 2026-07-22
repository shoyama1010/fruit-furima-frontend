"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { getImageUrl } from "@/lib/getImageUrl";

type ProductFormData = {
    name: string;
    price: string;
    description: string;
    image?: FileList;
    seasons?: string[];
};

type ApiResponse = {
    message?: string;
};

type Season = {
    id: number;
    name: string;
};

type Product = {
    id: number;
    user_id: number;
    name: string;
    price: number;
    description: string;
    image: string | null;
    seasons: Season[];
};

type User = {
    id: number;
    name: string;
    email: string;
};

export default function ProductEditPage() {
    const params = useParams();
    const router = useRouter();

    const productId = Array.isArray(params.id) ? params.id[0] : params.id;

    const [product, setProduct] = useState<Product | null>(null);
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [errorMessage, setErrorMessage] = useState("");

    const { register, handleSubmit, setValue } = useForm<ProductFormData>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setErrorMessage("");

                const token = localStorage.getItem("auth_token");

                if (!token) {
                    router.replace("/login");
                    return;
                }

                // ログインユーザー取得
                const userRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`,
                    {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!userRes.ok) {
                    localStorage.removeItem("auth_token");
                    router.replace("/login");
                    return;
                }

                const user: User = await userRes.json();

                // 商品取得
                const productRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${productId}`,
                    {
                        headers: {
                            Accept: "application/json",
                        },
                        cache: "no-store",
                    }
                );

                if (!productRes.ok) {
                    router.push("/products");
                    return;
                }

                const productData: Product = await productRes.json();

                if (Number(productData.user_id) !== Number(user.id)) {
                    alert("この商品は編集できません。");
                    router.push(`/products/${productId}`);
                    return;
                }

                // 季節一覧
                const seasonRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/seasons`,
                    {
                        headers: {
                            Accept: "application/json",
                        },
                    }
                );

                if (!seasonRes.ok) {
                    throw new Error("季節データ取得失敗");
                }

                const seasonData: Season[] = await seasonRes.json();

                setProduct(productData);
                setSeasons(seasonData);

                setValue("name", productData.name);
                setValue("price", String(productData.price));
                setValue("description", productData.description ?? "");
            } catch (err) {
                console.error(err);
                setErrorMessage("商品情報を取得できませんでした。");
            }
        };

        fetchData();
    }, [productId, router, setValue]);


    const onSubmit = async (data: ProductFormData) => {

        setErrorMessage("");

        const token = localStorage.getItem("auth_token");

        if (!token) {
            router.replace("/login");
            return;
        }

        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("price", data.price);
        formData.append("description", data.description);

        if (data.image?.length) {
            formData.append("image", data.image[0]);
        }

        data.seasons?.forEach((seasonId) => {
            formData.append("seasons[]", seasonId);
        });

        formData.append("_method", "PUT");

        try {

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${productId}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const responseData = await res.json().catch(() => ({}));

            if (res.status === 401) {
                localStorage.removeItem("auth_token");
                router.replace("/login");
                return;
            }

            if (res.status === 403) {
                setErrorMessage(responseData.message ?? "編集できません");
                return;
            }

            if (!res.ok) {
                setErrorMessage(responseData.message ?? "更新失敗");
                return;
            }

            router.push(`/products/${productId}`);

        } catch (err) {
            console.error(err);
            setErrorMessage("通信エラー");
        }
    };

    const handleDelete = async () => {

        if (!confirm("本当に削除しますか？")) return;

        const token = localStorage.getItem("auth_token");

        if (!token) {
            router.replace("/login");
            return;
        }

        try {

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${productId}`,
                {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const responseData = await res.json().catch(() => ({}));

            if (res.status === 401) {
                localStorage.removeItem("auth_token");
                router.replace("/login");
                return;
            }

            if (res.status === 403) {
                setErrorMessage(responseData.message ?? "削除できません");
                return;
            }

            if (!res.ok) {
                setErrorMessage(responseData.message ?? "削除失敗");
                return;
            }

            router.push("/mypage");

        } catch (err) {
            console.error(err);
            setErrorMessage("通信エラー");
        }
    };

    if (!product) {
        return <p className="text-center mt-10">読み込み中...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-6">商品編集</h1>

            {errorMessage && (
                <div className="mb-4 rounded bg-red-100 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block mb-1 font-semibold">商品名</label>
                    <input
                        type="text"
                        {...register("name")}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-semibold">値段</label>
                    <input
                        type="number"
                        {...register("price")}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-semibold">季節</label>
                    <div className="flex gap-4">
                        {seasons.map((season) => (
                            <label key={season.id} className="flex items-center gap-1">
                                <input
                                    type="checkbox"
                                    value={String(season.id)}
                                    {...register("seasons")}
                                    defaultChecked={product.seasons.some(
                                        (s) => s.id === season.id
                                    )}
                                />
                                {season.name}
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block mb-1 font-semibold">商品説明</label>
                    <textarea
                        {...register("description")}
                        rows={4}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-semibold">商品画像</label>
                    <input type="file" {...register("image")} />

                    {product.image && (

                        <Image
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            // width={400}
                            // height={240}
                            width={160}
                            height={160}
                            className="w-40 h-40 object-cover mt-2 rounded"
                            unoptimized
                        />
                    )}
                </div>

                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={() => router.push(`/products/${productId}`)}
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                    >
                        戻る
                    </button>

                    <button
                        type="submit"
                        className="bg-yellow-500 text-white px-4 py-2 rounded"
                    >
                        変更を保存
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        削除
                    </button>
                </div>
            </form>
        </div>
    );
}