# fruit-furima-frontend（フロントエンド）

##  概要

Laravel APIと連携したフルーツフリマSPA。  Next.jsを用いてクライアント側で状態管理・UI制御を行う。

# 作成した目的
Laravel Blade での従来の CRUD から、API 経由での CRUD に切り替える中で、

Next.js を利用して SPA 開発を実践し、フロントエンドの理解を深める中で、バリデーション・画像アップロード・検索/ソートなど、

実務でよく利用される機能をAPI 経由で扱えるよう理解し、あとSEO対策を兼ねるよう、プリレンダリング技術も検討しており、

より実用的なアプリケーションへ拡張することも目標としてます。

# アプリケーションURL
ローカル環境
http://localhost:3000

##  画面イメージ

<img width="1617" height="953" alt="Image" src="https://github.com/user-attachments/assets/eca9c91d-fb57-4674-a260-e8f62949063b" />

<img width="1731" height="961" alt="Image" src="https://github.com/user-attachments/assets/5b6ff091-5d85-485d-a05e-e9fde9e17786" />

<img width="1648" height="957" alt="Image" src="https://github.com/user-attachments/assets/7da3035a-b2c8-4818-8561-f2b51dc2e2a3" />

<img width="1682" height="964" alt="Image" src="https://github.com/user-attachments/assets/b2075d5d-0aca-4a2b-b0d0-08c7331d588b" />

<img width="1606" height="971" alt="Image" src="https://github.com/user-attachments/assets/0d538053-86cb-49dc-a3d8-0d26afb8c65a" />

# 機能一覧

- 認証機能
- 商品一覧表示
- 商品検索
- ソート（価格）
- ページネーション
- 商品詳細表示
- 商品登録
- 商品編集
- 商品削除
- 画像アップロード
- 季節カテゴリ選択

##  認証制御

- Cookie認証（credentials: include）
- 未ログイン時リダイレクト
- 編集画面で所有者チェック

# 使用技術

・Next.js 14

・React.js

・Node.js

・TypeScript（型定義は最小限）

・Webpack（Next.js 内部で使用）

・Babel（Next.js 内部で使用）

・css(Tailwind CSS)

・React Hooks (＝状態管理)


# 環境構築

## 1. リポジトリをクローン

git clone https://github.com/shoyama1010/fruit-furima-frontend.git

cd fruit-furima-frontend

## 2.　パッケージをインストール

npm install

## 3. 環境変数ファイルを作成

.env.local をプロジェクト直下に作成し、以下を設定してください。

（API エンドポイントをバックエンド側 Laravel の URL に合わせてください）

NEXT_PUBLIC_API_BASE_URL=http://localhost/api

## 4. 開発サーバーを起動

npm run dev

## 5. ビルド（本番用）

npm run build

npm run start

## 🧠 工夫した点

- React Hooksによる状態管理
- API連携の非同期処理設計
- ページネーションUIの実装
- 検索・ソートの即時反映
- フロント側での認可チェック

---

###########################################################################

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
