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

type User = {
  id: number;
  name: string;
  email: string;
};

export default function ProductsPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // ログイン確認
  useEffect(() => {
    const checkAuth = async () => {
      if (!API_BASE_URL) {
        console.error("API URLが設定されていません");
        router.replace("/login");
        return;
      }

      const token = localStorage.getItem("auth_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/user`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          localStorage.removeItem("auth_token");
          router.replace("/login");
          return;
        }

        const userData: User = await res.json();
        setUser(userData);
      } catch (error) {
        console.error("ログイン確認失敗:", error);
        localStorage.removeItem("auth_token");
        router.replace("/login");
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [API_BASE_URL, router]);

  // 商品取得
  useEffect(() => {
    if (!user || !API_BASE_URL) return;

    const fetchProducts = async () => {
      try {
        const query = new URLSearchParams();
        query.append("page", String(currentPage));

        if (search) query.append("search", search);
        if (sort) query.append("sort", sort);

        const res = await fetch(
          `${API_BASE_URL}/api/products?${query.toString()}`,
          {
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error(`商品取得失敗: ${res.status}`);
        }

        const data = await res.json();

        setProducts(data.data ?? []);
        setLastPage(data.last_page ?? 1);
      } catch (error) {
        console.error(error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [API_BASE_URL, search, sort, currentPage, user]);

  if (authLoading) {
    return <div>ログイン確認中...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <main className="mx-auto mt-8 max-w-6xl">
        <div className="mx-auto mt-8 flex max-w-6xl">
          <aside className="w-1/4 pr-6">
            <h2 className="mb-4 text-xl font-bold">商品一覧</h2>

            <input
              type="text"
              placeholder="商品名で検索"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="mb-2 w-full rounded border px-3 py-2"
            />

            <label className="mb-2 block">価格で並べ替え:</label>

            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded border px-3 py-2"
            >
              <option value="">選択してください</option>
              <option value="high">高い順</option>
              <option value="low">安い順</option>
            </select>
          </aside>

          <div className="w-3/4">
            <div className="mb-4 flex justify-end">
              <Link
                href="/products/create"
                className="rounded bg-yellow-400 px-4 py-2 text-white"
              >
                ＋ 商品を登録
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {products.map((product) => (
                <Link href={`/products/${product.id}`} key={product.id}>
                  <div className="rounded bg-white p-4 shadow">
                    <Image
                      src={`${API_BASE_URL}/storage/${product.image}`}
                      alt={product.name}
                      width={400}
                      height={160}
                      className="mb-2 h-40 w-full rounded object-cover"
                      unoptimized
                    />

                    <p className="font-bold">{product.name}</p>
                    <p>¥{product.price}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={currentPage === 1}
                className="rounded bg-gray-300 px-4 py-2 disabled:opacity-50"
              >
                前へ
              </button>

              <span className="py-2">
                {currentPage} / {lastPage}
              </span>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, lastPage)
                  )
                }
                disabled={currentPage === lastPage}
                className="rounded bg-gray-300 px-4 py-2 disabled:opacity-50"
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