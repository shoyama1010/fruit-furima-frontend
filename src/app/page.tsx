

// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  // 商品取得（検索・ソート付き）
  useEffect((): void => {
    const fetchProducts = async (): Promise<void> => {
      try {
        const query = new URLSearchParams();
        if (search) query.append("search", search);
        if (sort) query.append("sort", sort);

        // const res = await fetch(`http://localhost/api/products?${query.toString()}`, {
        //   credentials: "include",
        // });
        const res = await fetch(`http://localhost/api/products?${query.toString()}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("商品データの取得に失敗しました");

        const data = await res.json();
        
        setProducts(data.data || []);

      } catch (err) {
        console.error(err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [search, sort]);

  return (
    <div className="flex max-w-6xl mx-auto mt-8">
      {/* 左：検索＆ソート */}
      <aside className="w-1/4 pr-6">
        <h2 className="text-xl font-bold mb-4">商品一覧</h2>
        <input
          type="text"
          placeholder="商品名で検索"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border px-3 py-2 mb-2 rounded"
        />
        <button
          onClick={() => setSearch(search)}
          className="w-full bg-yellow-400 text-white py-2 rounded mb-4"
        >
          検索
        </button>

        <label className="block mb-2">価格で並べ替え:</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">選択してください</option>
          <option value="high">高い順</option>
          <option value="low">安い順</option>
        </select>
      </aside>

      {/* 右：商品一覧 */}
      <main className="flex-1">
        <div className="flex justify-end mb-4">
          <Link
            href="/products/create"
            className="bg-yellow-400 text-white px-4 py-2 rounded"
          >
            ＋ 商品を登録
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {products.map((product) => (

            <Link key={product.id} href={`/products/${product.id}`}>

              <div key={product.id} className="bg-white rounded shadow p-4">
                <img
                  // src={`http://localhost/storage/${product.image}`}
                  src={`http://localhost/storage/${product.image}`}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <p className="font-bold">{product.name}</p>
                <p>¥{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

