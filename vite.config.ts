import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // ◀◀ 追加
// VitePWA をインポート
import { VitePWA } from "vite-plugin-pwa";

const repositoryName = "react-todo-app"; // ◀◀ 追加

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        // ユーザーに通常表示されるアプリ名
        name: "Todo App",
        // name を表示するのに十分なスペースがない場合に表示されるアプリ名
        short_name: "Todo",
        // アプリの詳細な説明
        description: "Todo PWA対応",
        /**
         * アプリの開始 URL:
         * 通常はサーブするディレクトリそのもの
         */
        start_url: ".",
        /**
         * 表示モード:
         * fullscreen: フルスクリーン
         * standalone: 単独のアプリのようになる
         * minimal-ui: 最小限のブラウザ UI は残る
         * browser: 通常のブラウザ
         */
        display: "standalone",
        /**
         * アプリの向き:
         * portrait: 縦向き
         * landscape: 横向き
         * any: 向きを強制しない
         */
        orientation: "portrait",
        // 既定のテーマカラー
        theme_color: "#3f51b2",
        // スタイルシートが読み込まれる前に表示するアプリページの背景色
        background_color: "#efeff4",
        /**
         * favicon やアプリアイコンの配列:
         * 最低でも 192x192ビクセルと512x512ビクセルの 2 つのアプリアイコンが必要
         */
        icons: [
          {
            src: "web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
            // 用途をマスカブルアイコンとする
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  // ▼▼ 追加 ここから ▼▼
  base: process.env.NODE_ENV === "production" ? `/${repositoryName}/` : "/",
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        404: path.resolve(__dirname, "404.html"),
      },
    },
  },
  // ▲▲ 追加 ここまで ▲▲
  server: {
    port: 3000, // デフォルトのポートを3000に設定
    strictPort: false,
    open: true,
  },
});
