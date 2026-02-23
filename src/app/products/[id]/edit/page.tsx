"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface Season {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    seasons: Season[];
}

export default function ProductEditPage() {
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [seasons, setSeasons] = useState<Season[]>([]);

    const { register, handleSubmit, setValue } = useForm();

    // 商品詳細と季節データを取得
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productRes, seasonRes] = await Promise.all([
                    fetch(`http://localhost/api/products/${params.id}`, { credentials: "include" }),
                    fetch(`http://localhost/api/seasons`, { credentials: "include" }),
                ]);
                const productData = await productRes.json();
                const seasonData = await seasonRes.json();

                setProduct(productData);
                setSeasons(seasonData);

                // React Hook Form に初期値をセット
                setValue("name", productData.name);
                setValue("price", productData.price);
                setValue("description", productData.description);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [params.id, setValue]);

    // 更新処理
    const onSubmit = async (data: any) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("price", data.price);
        formData.append("description", data.description);

        if (data.image?.[0]) {
            formData.append("image", data.image[0]);
        }

        (data.seasons || []).forEach((seasonId: string) => {
            formData.append("seasons[]", seasonId);
        });

        formData.append("_method", "PUT");

        try {
            const res = await fetch(`http://localhost/api/products/${params.id}`, {
                method: "POST", // Laravel の場合 PUT/PATCH は FormData で難しいので POST + _method で代用
                body: formData,
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                },
            });

            if (!res.ok) throw new Error("更新に失敗しました");

            alert("商品を更新しました！");
            router.push(`/products/${params.id}`);
        } catch (err) {
            console.error(err);
            alert("エラーが発生しました");
        }
    };

    if (!product) return <p className="text-center mt-10">読み込み中...</p>;

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-6">商品編集</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* 商品名 */}
                <div>
                    <label className="block mb-1 font-semibold">商品名</label>
                    <input
                        type="text"
                        {...register("name")}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                {/* 値段 */}
                <div>
                    <label className="block mb-1 font-semibold">値段</label>
                    <input
                        type="number"
                        {...register("price")}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                {/* 季節 */}
                <div>
                    <label className="block mb-1 font-semibold">季節</label>
                    <div className="flex gap-4">
                        {seasons.map((season) => (
                            <label key={season.id} className="flex items-center gap-1">
                                <input
                                    type="checkbox"
                                    value={season.id}
                                    {...register("seasons")}
                                    defaultChecked={product.seasons.some((s) => s.id === season.id)}
                                />
                                {season.name}
                            </label>
                        ))}
                    </div>
                </div>

                {/* 商品説明 */}
                <div>
                    <label className="block mb-1 font-semibold">商品説明</label>
                    <textarea
                        {...register("description")}
                        rows={4}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                {/* 画像 */}
                <div>
                    <label className="block mb-1 font-semibold">商品画像</label>
                    <input type="file" {...register("image")} />
                    {product.image && (
                        <img
                            src={`http://localhost/storage/${product.image}`}
                            alt={product.name}
                            className="w-40 h-40 object-cover mt-2 rounded"
                        />
                    )}
                </div>

                {/* ボタン */}
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={() => router.push(`/products/${params.id}`)}
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
                </div>
            </form>
        </div>
    );
}
