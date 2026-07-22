"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getImageUrl } from "@/lib/getImageUrl";

interface Season {
    id: number;
    name: string;
}

interface Product {
    id: number;
    user_id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    seasons: Season[];
}

interface User {
    id: number;
    name: string;
}

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();

    const [product, setProduct] = useState<Product | null>(null);
    const [user, setUser] = useState<User | null>(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 商品取得（公開API）
                const productRes = await fetch(
                    `${API_BASE_URL}/api/products/${params.id}`,
                    {
                        headers: {
                            Accept: "application/json",
                        },
                        cache: "no-store",
                    }
                );

                if (!productRes.ok) {
                    throw new Error("商品取得失敗");
                }

                const productData = await productRes.json();
                setProduct(productData);

                // ログイン中ならユーザー取得
                const token = localStorage.getItem("auth_token");

                if (token) {
                    const userRes = await fetch(
                        `${API_BASE_URL}/api/user`,
                        {
                            headers: {
                                Accept: "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (userRes.ok) {
                        const userData = await userRes.json();
                        setUser(userData);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [API_BASE_URL, params.id]);

    if (!product) {
        return (
            <p className="text-center mt-10">
                読み込み中...
            </p>
        );
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded shadow">

            <h1 className="text-2xl font-bold mb-4">
                {product.name}
            </h1>

            <Image
                src={getImageUrl(product.image)}
                alt={product.name}
                width={800}
                height={256}
                className="w-full h-64 object-cover rounded mb-4"
                unoptimized
            />

            <p className="text-lg font-semibold mb-2">
                価格：¥{product.price}
            </p>

            <p className="mb-4">
                {product.description}
            </p>

            <div className="mb-4">
                <h2 className="font-semibold mb-2">
                    季節
                </h2>

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

            <div className="flex justify-between mt-6">

                <button
                    onClick={() => router.push("/products")}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                    戻る
                </button>

                {user && user.id === product.user_id && (
                    <button
                        onClick={() =>
                            router.push(`/products/${product.id}/edit`)
                        }
                        className="bg-yellow-500 text-white px-4 py-2 rounded"
                    >
                        編集する
                    </button>
                )}

            </div>

        </div>
    );
}