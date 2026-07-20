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
    const [errorMessage, setErrorMessage] = useState("");

    const router = useRouter();
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        const checkAuthAndFetch = async () => {
            setErrorMessage("");

            if (!API_BASE_URL) {
                setErrorMessage("APIのURLが設定されていません。");
                setLoading(false);
                return;
            }

            const token = localStorage.getItem("auth_token");

            if (!token) {
                router.replace("/login");
                return;
            }

            try {
                // ログインユーザー確認
                const userRes = await fetch(`${API_BASE_URL}/api/user`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (userRes.status === 401) {
                    localStorage.removeItem("auth_token");
                    router.replace("/login");
                    return;
                }

                if (!userRes.ok) {
                    throw new Error("ログインユーザーの取得に失敗しました");
                }

                // プロフィール取得
                const profileRes = await fetch(
                    `${API_BASE_URL}/api/profile`,
                    {
                        method: "GET",
                        cache: "no-store",
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (profileRes.status === 401) {
                    localStorage.removeItem("auth_token");
                    router.replace("/login");
                    return;
                }

                if (!profileRes.ok) {
                    throw new Error("プロフィール取得に失敗しました");
                }

                const data: Profile = await profileRes.json();
                setProfile(data);
            } catch (error) {
                console.error("プロフィール取得エラー:", error);
                setErrorMessage("プロフィール情報を取得できませんでした。");
            } finally {
                setLoading(false);
            }
        };

        checkAuthAndFetch();
    }, [API_BASE_URL, router]);

    if (loading) {
        return <p className="p-6">読み込み中...</p>;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md rounded bg-white p-8 shadow-md">
                <h1 className="mb-6 text-center text-2xl font-bold">
                    プロフィール
                </h1>

                {errorMessage && (
                    <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {errorMessage}
                    </div>
                )}

                {profile ? (
                    <div className="space-y-4">
                        {profile.img_url && (
                            <div className="flex justify-center">
                                <Image
                                    src={`${API_BASE_URL}/${profile.img_url}`}
                                    alt="プロフィール画像"
                                    width={96}
                                    height={96}
                                    className="h-24 w-24 rounded-full object-cover"
                                    unoptimized
                                />
                            </div>
                        )}

                        <p>
                            <strong>ユーザー名:</strong>{" "}
                            {profile.name || "未登録"}
                        </p>

                        <p>
                            <strong>郵便番号:</strong>{" "}
                            {profile.postcode || "未登録"}
                        </p>

                        <p>
                            <strong>住所:</strong>{" "}
                            {profile.address || "未登録"}
                        </p>

                        <p>
                            <strong>電話番号:</strong>{" "}
                            {profile.phone_number || "未登録"}
                        </p>

                        <button
                            type="button"
                            onClick={() => router.push("/profile/edit")}
                            className="mt-4 w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600"
                        >
                            プロフィールを編集
                        </button>
                    </div>
                ) : (
                    !errorMessage && (
                        <p className="text-center text-gray-500">
                            プロフィール情報がありません。
                        </p>
                    )
                )}
            </div>
        </div>
    );
}

