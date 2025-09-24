

import "./globals.css";
import Header from "../components/Header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50">
        <Header />
        <main className="max-w-6xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
