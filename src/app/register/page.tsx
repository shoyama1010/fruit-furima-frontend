"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        alert("登録失敗: " + (data.message || "不明なエラー"));
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.user.email);

      alert("登録成功: " + data.user.email);
      router.push("/dashboard");
    } catch (error) {
      console.error("Register error:", error);
      alert("通信エラーが発生しました");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">会員登録</h1>

        <input
          type="text"
          placeholder="名前"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="email"
          placeholder="メール"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="パスワード"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          登録
        </button>
      </form>
    </div>
  );
}


// "use client";
// import { useState } from "react";

// export default function RegisterPage() {
//   const [form, setForm] = useState({ name: "", email: "", password: "" });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const res = await fetch("http://localhost/api/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });
//     const data = await res.json();
//     console.log(data);
//     alert("登録完了: " + JSON.stringify(data));
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-4">
//       <input
//         type="text"
//         placeholder="名前"
//         value={form.name}
//         onChange={(e) => setForm({ ...form, name: e.target.value })}
//       /><br />
//       <input
//         type="email"
//         placeholder="メール"
//         value={form.email}
//         onChange={(e) => setForm({ ...form, email: e.target.value })}
//       /><br />
//       <input
//         type="password"
//         placeholder="パスワード"
//         value={form.password}
//         onChange={(e) => setForm({ ...form, password: e.target.value })}
//       /><br />
//       <button type="submit"
//         className="mt-4 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600">
//         新規登録</button>
//     </form>
//   );
// }
