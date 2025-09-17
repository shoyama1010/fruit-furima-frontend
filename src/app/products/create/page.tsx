// src/app/products/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProductPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        if (image) formData.append("image", image);

        await fetch("http://localhost/api/products", {
            method: "POST",
            body: formData,
            credentials: "include",
        });

        router.push("/products");
    };

    return (
        <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-4">商品登録</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="商品名"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    type="number"
                    placeholder="価格"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                />
                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    className="w-full"
                />
                <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 rounded"
                >
                    登録する
                </button>
            </form>
        </div>
    );
}
