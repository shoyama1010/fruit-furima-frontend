// src/app/products/create/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface FormData {
    name: string;
    price: number;
    description: string;
    seasons: string[];
    image: FileList;
}

export default function ProductCreatePage() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [preview, setPreview] = useState<string | null>(null);

    // ✅ ここを追加（ログインチェック）
    // useEffect(() => {
    //     const checkLogin = async () => {
    //         try {
    //             const res = await fetch("http://localhost/api/user", {
    //                 // credentials: "include",
    //                 headers: { "Content-Type": "application/json" }
    //             });
    //             // if (!res.ok) {
    //             //     router.push("/login"); // 未ログインならログイン画面へ
    //             // }
    //             if (!res.ok) throw new Error("登録失敗");
    //             alert("商品を登録しました！");
    //             router.push("/products");
    //         } catch (err) {
    //             console.error(err);
    //             // router.push("/login"); // エラーでも安全のためログイン画面へ
    //             alert("商品登録に失敗しました");
    //         }
    //     };
    //     // checkLogin();
    //     return (
    //         <div>
    //             {/* フォームUIはそのまま */}
    //         </div>
    //     );
    // }, []);
        // [router]);
    //✅ 追加ここまで

    // プレビュー表示
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPreview(URL.createObjectURL(file));
        }
    };

    // 登録処理
    const onSubmit = async (data: FormData) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("price", String(data.price));
        formData.append("description", data.description);

        if (data.image?.[0]) {
            formData.append("image", data.image[0]);
        }

        data.seasons.forEach(season => formData.append("seasons[]", season));

        try {
            const res = await fetch("http://localhost/api/products", {
                method: "POST",
                body: formData,
                // credentials: "include",
                headers: { "Accept": "application/json" }
            });

            // デバッグ追加
            const debug = await res.text();
            console.log("API Response:", res.status, debug);

            if (!res.ok) throw new Error("登録失敗");

            alert("商品を登録しました！");
            router.push("/products");

        } catch (err) {
            console.error(err);
            alert("エラーが発生しました");
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
            <h2 className="text-2xl font-bold text-center mb-6">商品登録</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* 商品名 */}
                <div>
                    <label className="block font-semibold">商品名 <span className="text-red-500">必須</span></label>
                    <input
                        type="text"
                        {...register("name", { required: "商品名は必須です" })}
                        className={`w-full border rounded p-2 ${errors.name ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                {/* 値段 */}
                <div>
                    <label className="block font-semibold">値段 <span className="text-red-500">必須</span></label>
                    <input
                        type="number"
                        {...register("price", { required: "値段は必須です" })}
                        className={`w-full border rounded p-2 ${errors.price ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                </div>

                {/* 商品画像 */}
                <div>
                    <label className="block font-semibold">商品画像 <span className="text-red-500">必須</span></label>
                    <input
                        type="file"
                        accept="image/*"
                        {...register("image", { required: "商品画像は必須です" })}
                        onChange={handleImageChange}
                        className="block mt-1"
                    />
                    {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
                    {preview && <img src={preview} alt="プレビュー" className="mt-3 w-48 rounded shadow" />}
                </div>

                {/* 季節 */}
                <div>
                    <label className="block font-semibold">季節 <span className="text-red-500">必須</span></label>
                    <div className="flex gap-4 mt-2">
                        {["春", "夏", "秋", "冬"].map((season, i) => (
                            <label key={i} className="flex items-center gap-1">
                                <input type="checkbox" value={String(i + 1)} {...register("seasons", { required: "季節は必須です" })} />
                                {season}
                            </label>
                        ))}
                    </div>
                    {errors.seasons && <p className="text-red-500 text-sm">{errors.seasons.message}</p>}
                </div>

                {/* 商品説明 */}
                <div>
                    <label className="block font-semibold">商品説明 <span className="text-red-500">必須</span></label>
                    <textarea
                        rows={4}
                        {...register("description", { required: "商品説明は必須です" })}
                        className={`w-full border rounded p-2 ${errors.description ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
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
                        className="bg-yellow-400 text-white px-6 py-2 rounded hover:bg-yellow-500"
                    >
                        登録
                    </button>
                </div>
            </form>
        </div>
    );
}
