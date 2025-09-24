"use client";

import { useEffect, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";

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
    // seasons: { id: number; name: string }[];
    seasons: Season[];
}

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost/api/products/${params.id}`, {
                
                    credentials: "include",
                });
                if (!res.ok) throw new Error("データ取得失敗");
                const data = await res.json();
                setProduct(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchProduct();
    }, [params.id]);

    if (!product) return <p className="text-center mt-10">読み込み中...</p>;

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded shadow">
            {/* 商品名 */}
            <h1 className="text-2xl font-bold mb-4">{product.name}</h1>

            {/* 画像 */}
            <img
                src={`http://localhost/storage/${product.image}`}
                alt={product.name}
                className="w-full h-64 object-cover rounded mb-4"
            />

            {/* 値段 */}
            <p className="text-lg font-semibold mb-2">価格: ¥{product.price}</p>

            {/* 商品説明 */}
            <p className="mb-4">{product.description}</p>

            {/* 季節タグ */}
            <div className="mb-4">
                <h2 className="font-semibold mb-2">季節:</h2>
                <div className="flex gap-2">
                    {product.seasons.map((season) => (
                        <span
                            key={season.id}
                            className="px-3 py-1 bg-gray-200 rounded-full text-sm"
                        >
                            {season.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* ボタン操作 */}
            <div className="flex justify-between mt-6">
                <button
                    onClick={() => router.push("/products")}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                    戻る
                </button>
                <button
                    onClick={() => router.push(`/products/${product.id}/edit`)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                    編集する
                </button>
            </div>
        </div>
    );
}

