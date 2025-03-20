import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

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
  console.log("✅ Privacy Policy PDF copied to /docs/");
};

copyFiles();
