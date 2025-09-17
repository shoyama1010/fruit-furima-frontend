
// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";

// type Season = {
//   id: number;
//   name: string;
// };

// type Product = {
//   id: number;
//   name: string;
//   price: number;
//   image: string;
//   description: string;
//   seasons: Season[];
// };

// export default function Home() {
//   const [products, setProducts] = useState<Product[]>([]);

//   useEffect(() => {
//     fetch("http://localhost/api/products")
//       .then((res) => res.json())
//       .then((data) => setProducts(data))
//       .catch((err) => console.error(err));
//   }, []);

//   return (
//     <main className="max-w-6xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">商品一覧</h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {products.map((product) => (
//           <Link
//             key={product.id}
//             href={`/products/${product.id}`}
//             className="block"
//           >
//             <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer">
//               <img
//                 src={`http://localhost/storage/${product.image}`}
//                 alt={product.name}
//                 className="w-full h-48 object-cover"
//               />
//               <div className="p-4">
//                 <h2 className="text-lg font-bold">{product.name}</h2>
//                 <p className="text-gray-600">¥{product.price}</p>
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </main>
//   );
// }

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

      const res = await fetch(`http://localhost/api/products?${query.toString()}`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("商品データの取得に失敗しました");

        const data = await res.json();
        console.log("API Response:", data); // 👈 これで実際のレスポンス形式を確認
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

