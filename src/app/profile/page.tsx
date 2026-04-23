"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Profile = {
    id: number;
    name: string;
    email: string;
    postcode: string | null;
    address: string | null;
    phone_number: string | null;
    img_url: string | null;
};

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuthAndFetch = async () => {
            try {
                const userRes = await fetch("http://localhost/api/user", {
                    credentials: "include",
                });

                if (!userRes.ok) {
                    alert("ログインしてください");
                    router.push("/login");
                    return;
                }

                const res = await fetch("http://localhost/api/profile", {
                    credentials: "include",
                    cache: "no-store",
                });

                if (!res.ok) throw new Error("プロフィール取得失敗");

                const data = await res.json();
                setProfile(data);
            } catch (err) {
                console.error(err);
                alert("プロフィール情報を取得できませんでした");
            } finally {
                setLoading(false);
            }
        };

        checkAuthAndFetch();
    }, [router]);

    if (loading) return <p className="p-6">読み込み中...</p>;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">プロフィール</h1>

                {profile && (
                    <div className="space-y-4">
                        {profile.img_url && (
                            <div className="flex justify-center">
                                <Image
                                    src={`http://localhost/${profile.img_url}`}
                                    alt="プロフィール画像"
                                    width={96}
                                    height={96}
                                    className="rounded-full object-cover"
                                />
                            </div>
                        )}

                        <p>
                            <strong>ユーザー名:</strong> {profile.name || "未登録"}
                        </p>
                        <p>
                            <strong>郵便番号:</strong> {profile.postcode || "未登録"}
                        </p>
                        <p>
                            <strong>住所:</strong> {profile.address || "未登録"}
                        </p>
                        <p>
                            <strong>電話番号:</strong> {profile.phone_number || "未登録"}
                        </p>

                        <button
                            onClick={() => router.push("/profile/edit")}
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mt-4"
                        >
                            プロフィールを編集
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

