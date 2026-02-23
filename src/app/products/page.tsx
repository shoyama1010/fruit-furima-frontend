"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function ProductsPage() {
  const router = useRouter();
  // interface User {
  //   id: number;
  //   name: string;
  //   // 他に必要なユーザープロパティがあればここに追加
  // }
  // const [user, setUser] = useState<User | null>(null);
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  // 🔐 ログイン確認
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost/api/user", {
          credentials: "include",
        });

        if (!res.ok) {
          router.replace("/login");
          return;
        }
        
        const userData = await res.json();
        // const data = await res.json();
        setUser(userData);

      } catch (err) {
        console.error(err);
      }
    };

    checkAuth();
  }, []);

  // 📦 商品取得
  useEffect(() => {
    if (!user) return;

    const fetchProducts = async () => {
      try {
        const query = new URLSearchParams();
        if (search) query.append("search", search);
        if (sort) query.append("sort", sort);

        const res = await fetch(
          `http://localhost/api/products?${query.toString()}`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("商品取得失敗");

        const data = await res.json();
        setProducts(data.data || []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [search, sort, user]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex max-w-6xl mx-auto mt-8">
      <aside className="w-1/4 pr-6">
        <h2 className="text-xl font-bold mb-4">商品一覧</h2>

        <input
          type="text"
          placeholder="商品名で検索"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border px-3 py-2 mb-2 rounded"
        />

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
              <div className="bg-white rounded shadow p-4">
                <Image
                  src={`http://localhost/storage/${product.image}`}
                  alt={product.name}
                  width={400}
                  height={160}
                  className="w-full h-40 object-cover rounded mb-2"
                  unoptimized
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