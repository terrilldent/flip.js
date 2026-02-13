#!/usr/bin/env bun
import { join, extname } from "node:path";

const port = Number(process.env.PORT || 3000);
const root = process.cwd();

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
};

const server = Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);
    let pathname = decodeURIComponent(url.pathname);

    if (pathname === "/") {
      pathname = "/examples/basic-book/";
    }

    let filePath = join(root, pathname);

    if (pathname.endsWith("/")) {
      filePath = join(filePath, "index.html");
    }

    const file = Bun.file(filePath);

    if (!(await file.exists())) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(file, {
      headers: {
        "content-type": contentTypes[extname(filePath)] || "application/octet-stream",
      },
    });
  },
});

console.log(`flip.js dev server running at http://localhost:${server.port}`);
console.log("Opening / serves examples/basic-book by default.");
