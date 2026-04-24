"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";

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
  email: string;
}

export default function ProductEditPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setErrorMessage("");

        const userRes = await fetch("http://localhost/api/user", {
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (!userRes.ok) {
          router.push("/login");
          return;
        }

        const user: User = await userRes.json();

        const productRes = await fetch(
          `http://localhost/api/products/${params.id}`,
          {
            credentials: "include",
            headers: { Accept: "application/json" },
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
          router.push(`/products/${params.id}`);
          return;
        }

        const seasonRes = await fetch("http://localhost/api/seasons", {
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (!seasonRes.ok) {
          throw new Error("季節データの取得に失敗しました");
        }

        const seasonData: Season[] = await seasonRes.json();

        setProduct(productData);
        setSeasons(seasonData);

        setValue("name", productData.name);
        setValue("price", productData.price);
        setValue("description", productData.description);
      } catch (err) {
        console.error(err);
        setErrorMessage("商品情報を取得できませんでした。");
      }
    };

    fetchData();
  }, [params.id, router, setValue]);

  const onSubmit = async (data: any) => {
    setErrorMessage("");

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
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      const responseData = await res.json();

      if (res.status === 403) {
        setErrorMessage(responseData.message || "この商品は編集できません。");
        return;
      }

      if (!res.ok) {
        setErrorMessage(responseData.message || "更新に失敗しました。");
        return;
      }

      router.push(`/products/${params.id}`);
    } catch (err) {
      console.error(err);
      setErrorMessage("通信エラーが発生しました。");
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm("本当に削除しますか？");
    if (!ok) return;

    setErrorMessage("");

    try {
      const res = await fetch(`http://localhost/api/products/${params.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      const responseData = await res.json();

      if (res.status === 403) {
        setErrorMessage(responseData.message || "この商品は削除できません。");
        return;
      }

      if (!res.ok) {
        setErrorMessage(responseData.message || "削除に失敗しました。");
        return;
      }

      router.push("/mypage");
    } catch (error) {
      console.error(error);
      setErrorMessage("削除時に通信エラーが発生しました。");
    }
  };

  if (!product) return <p className="text-center mt-10">読み込み中...</p>;

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
                  value={season.id}
                  {...register("seasons")}
                  defaultChecked={product.seasons.some((s) => s.id === season.id)}
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
              src={`http://localhost/storage/${product.image}`}
              alt={product.name}
              width={160}
              height={160}
              className="w-40 h-40 object-cover mt-2 rounded"
            />
          )}
        </div>

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