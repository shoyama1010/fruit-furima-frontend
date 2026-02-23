"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("ログインしてください");
            router.push("/login");
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch("http://localhost/api/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                if (!res.ok) throw new Error("プロフィール取得失敗");

                const data = await res.json();
                setProfile(data);
            } catch (err) {
                console.error(err);
                alert("プロフィール情報を取得できませんでした");;
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    if (loading) return <p className="p-6">読み込み中...</p>;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">プロフィール</h1>

                {profile && (
                    <div className="space-y-4">
                        {/* アイコン */}
                        {profile.img_url && (
                            <div className="flex justify-center">
                                <img
                                    src={`http://localhost/storage/${profile.img_url}`}
                                    alt="プロフィール画像"
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                            </div>
                        )}

                        {/* ユーザー情報 */}
                        <p><strong>ユーザー名:</strong> {profile?.user?.name}</p>
                        <p><strong>郵便番号:</strong> {profile?.profile?.postcode}</p>
                        <p><strong>住所:</strong> {profile?.profile?.address}</p>
                        <p><strong>電話番号:</strong> {profile?.profile?.phone_number}</p>

                        {/* 編集ボタン */}
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
