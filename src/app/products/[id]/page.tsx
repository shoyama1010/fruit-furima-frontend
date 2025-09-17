import { notFound } from "next/navigation";

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    seasons: { id: number; name: string }[];
}

async function getProduct(id: string): Promise<Product | null> {
    try {
        const res = await fetch(`http://localhost/api/products/${id}`, {
            cache: "no-store", // 最新データを取得
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
    const product = await getProduct(params.id);

    if (!product) {
        notFound();
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
            <img
                src={`http://localhost/storage/${product.image}`}
                alt={product.name}
                className="w-full h-64 object-cover rounded mb-4"
            />
            <p className="text-lg mb-2">価格: ¥{product.price}</p>
            <p className="mb-2">商品説明: {product.description}</p>
            <div>
                <h2 className="font-semibold">季節:</h2>
                <ul className="flex gap-2 mt-1">
                    {product.seasons.map((season) => (
                        <li key={season.id} className="px-2 py-1 bg-gray-200 rounded">
                            {season.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
