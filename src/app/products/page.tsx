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

  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // 🔐 ログイン確認
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost/api/user", {
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          router.replace("/login");
          return;
        }

        const userData = await res.json();
        setUser(userData);

      } catch (err) {
        console.error(err);
      }
    };

    checkAuth();
  }, [router]);

  // 📦 商品取得
  useEffect(() => {
    if (!user) return;

    const fetchProducts = async () => {
      try {
        const query = new URLSearchParams();
        query.append("page", String(currentPage));

        if (search) query.append("search", search);
        if (sort) query.append("sort", sort);

        const res = await fetch(
          `http://localhost/api/products?${query.toString()}`,
          {
            credentials: "include",
            headers: { Accept: "application/json" },
            cache: "no-store",
          }
        );

        if (!res.ok) throw new Error("商品取得失敗");
        const data = await res.json();

        setProducts(data.data);
        // setCurrentPage(data.current_page);
        setLastPage(data.last_page);
      } catch (err) {
        console.error(err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [search, sort, currentPage, user]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <main className="max-w-6xl mx-auto mt-8">
        <div className="flex max-w-6xl mx-auto mt-8">
          <aside className="w-1/4 pr-6">
            <h2 className="text-xl font-bold mb-4">商品一覧</h2>

            <input
              type="text"
              placeholder="商品名で検索"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1); // 検索ワードが変わったらページをリセット
               }}
              className="w-full border px-3 py-2 mb-2 rounded"
            />

            <label className="block mb-2">価格で並べ替え:</label>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value)
                setCurrentPage(1); // 並び替えが変わったらページをリセット
              }}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">選択してください</option>
              <option value="high">高い順</option>
              <option value="low">安い順</option>
            </select>
          </aside>

          <div className="w-3/4">
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
                <Link href={`/products/${product.id}`} key={product.id}>
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

            {/* ページネーション */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                前へ
              </button>

              <span className="py-2">
                {currentPage} / {lastPage}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}
                disabled={currentPage === lastPage}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                次へ
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
  
}