"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Product = {
    id: number;
    name: string;
    price: number;
    image: string | null;
    description: string | null;
};

export default function MyPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchMyProducts = async () => {
            try {
                const res = await fetch("http://localhost/api/my-products", {
                    credentials: "include",
                    cache: "no-store",
                    headers: {
                        Accept: "application/json",
                    },
                });

                if (res.status === 401) {
                    router.push("/login");
                    return;
                }

                if (!res.ok) {
                    setErrorMessage("出品した商品を取得できませんでした。");
                    return;
                }

                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.error(error);
                setErrorMessage("通信エラーが発生しました。");
            } finally {
                setLoading(false);
            }
        };

        fetchMyProducts();
    }, [router]);

    if (loading) {
        return <p className="p-6">読み込み中...</p>;
    }

    return (
        <div className="max-w-5xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6">マイページ</h1>

            <div className="bg-white rounded shadow p-6">
                <h2 className="text-xl font-bold mb-4">出品した商品</h2>

                {errorMessage && (
                    <p className="mb-4 text-red-500">{errorMessage}</p>
                )}

                {products.length === 0 ? (
                    <p>出品した商品はありません。</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="border rounded shadow-sm p-4 bg-white"
                            >
                                {product.image && (
                                    <Image
                                        src={`http://localhost/storage/${product.image}`}
                                        alt={product.name}
                                        width={400}
                                        height={240}
                                        className="w-full h-40 object-cover rounded mb-3"
                                        unoptimized
                                    />
                                )}

                                <h3 className="font-bold">{product.name}</h3>
                                <p>¥{product.price}</p>

                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => router.push(`/products/${product.id}`)}
                                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                                    >
                                        詳細
                                    </button>

                                    <button
                                        onClick={() => router.push(`/products/${product.id}/edit`)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                    >
                                        編集
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}