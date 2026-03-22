#!/usr/bin/env bun
import { extname, join, normalize, resolve } from "node:path";

const port = Number(process.env.PORT || 3000);
const root = process.cwd();
const defaultPath = process.env.DEV_ROOT || "/examples/";

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
};

const resolveFilePath = (pathname) => {
  const safePath = normalize(decodeURIComponent(pathname)).replace(/^\.+/, "");
  const absolutePath = resolve(root, `.${safePath}`);

  if (!absolutePath.startsWith(resolve(root))) {
    return null;
  }

  return absolutePath;
};

const server = Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);
    let pathname = url.pathname;

    if (pathname === "/") {
      pathname = defaultPath;
    }

    let filePath = resolveFilePath(pathname);

    if (!filePath) {
      return new Response("Invalid path", { status: 400 });
    }

    if (pathname.endsWith("/")) {
      filePath = join(filePath, "index.html");
    }

    const file = Bun.file(filePath);

    if (!(await file.exists())) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(file, {
      headers: {
        "cache-control": "no-store",
        "content-type": contentTypes[extname(filePath)] || "application/octet-stream",
      },
    });
  },
});

console.log(`flip.js dev server running at http://localhost:${server.port}`);
console.log(`Default route: ${defaultPath}`);
console.log("Tip: set DEV_ROOT=/examples/basic-book/ (or any folder) before running bun run dev.");
