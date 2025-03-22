import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync } from "fs";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
  build: {
    outDir: "docs", // Met le build dans docs/ pour GitHub Pages
    rollupOptions: {
      input: "index.html", // Assure que le bon fichier index.html est pris
    }
  },
  base: "./", // Assure le bon chargement des assets sur GitHub Pages
});

const copyFiles = () => {
  copyFileSync(
    "user_doc/privacy_policy/privacy_policy.pdf",
    "docs/privacy_policy.pdf"
  );
  copyFileSync(
    "user_doc/user_doc.pdf",
    "docs/user_doc.pdf"
  );

  console.log("PDF copied to /docs/");
};

copyFiles();
