import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const appShell = (entry) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#f4f5f0">
    <title>Parkside | Campus Parking</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${entry}"></script>
  </body>
</html>`;

function generatedHtmlShell() {
  return {
    name: "generated-html-shell",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (
          request.method !== "GET" ||
          request.url?.startsWith("/@") ||
          request.url?.startsWith("/api/") ||
          request.url?.includes(".")
        ) {
          next();
          return;
        }
        response.statusCode = 200;
        response.setHeader("Content-Type", "text/html");
        response.end(appShell("/src/main.jsx"));
      });
    },
    generateBundle(_options, bundle) {
      const entry = Object.values(bundle).find(
        (item) => item.type === "chunk" && item.isEntry
      );
      if (!entry) throw new Error("Could not find the frontend JavaScript entry point.");
      const styles = entry.viteMetadata?.importedCss ?? new Set();
      const styleLinks = [...styles]
        .map((fileName) => `<link rel="stylesheet" href="/${fileName}">`)
        .join("\n    ");
      this.emitFile({
        type: "asset",
        fileName: "index.html",
        source: appShell(`/${entry.fileName}`).replace(
          "</head>",
          `    ${styleLinks}\n  </head>`
        )
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), generatedHtmlShell()],
  server: {
    proxy: {
      "/api": "http://localhost:8081"
    }
  },
  build: {
    outDir: "../frontend-build",
    emptyOutDir: true,
    rollupOptions: {
      input: "src/main.jsx",
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]"
      }
    }
  }
});
