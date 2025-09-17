"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();

            if (!res.ok) {
                alert("ログイン失敗: " + (data.message || "不明なエラー"));
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("userEmail", form.email);

            router.push("/dashboard");
            
        } catch (error) {
            console.error(error);
            alert("通信エラーが発生しました");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md w-96"
            >
                <h1 className="text-2xl font-bold mb-6 text-center">ログイン</h1>
                <input
                    type="email"
                    placeholder="メールアドレス"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full p-2 mb-4 border rounded"
                />
                <input
                    type="password"
                    placeholder="パスワード"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full p-2 mb-4 border rounded"
                />
                <button
                    type="submit"
                    className="w-full py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
                >
                    ログイン
                </button>
            </form>
        </div>
    );
}


// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//     const [form, setForm] = useState({ email: "", password: "" });
//     const router = useRouter();

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         try { 
//             const res = await fetch("http://localhost/api/login", { 
//             method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Accept": "application/json",
//              },
//                 body: JSON.stringify(form),
//                 // credentials: "include", // クッキーを含める（Sanctum対応やCORSで有効）
//         });
            
//             const data = await res.json();
//             console.log("Login response:", data);

//             if (!res.ok) {
//                 // Laravel 側からのエラーメッセージを表示
//                 alert("ログイン失敗: " + (data.message || "不明なエラー"));
//                 return;
//             }
//             // token を保存
//             localStorage.setItem("token", data.token);
//             // alert("ログイン成功: " + data.user.email);
//             alert("ログイン成功: " + form.email);
            
//             // ✅ ログイン後に /dashboard へ遷移
//             router.push("/dashboard");

//         } catch (error) {
//             console.error("Login error:", error);
//             alert("通信エラーが発生しました");
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="p-4">
//             <input
//                 type="email"
//                 placeholder="メール"
//                 value={form.email}
//                 onChange={(e) => setForm({ ...form, email: e.target.value })}
//                 className="border p-2 mb-2 w-full"
//             /><br />
//             <input
//                 type="password"
//                 placeholder="パスワード"
//                 value={form.password}
//                 onChange={(e) => setForm({ ...form, password: e.target.value })}
//                 className="border p-2 mb-2 w-full"
//             /><br />
//             <button type="submit"
//                 className="mt-4 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600">ログイン</button>
//         </form>
//     );
// }
