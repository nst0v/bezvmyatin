import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "dist");
const port = Number(process.argv[3] ?? 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
};
const server = createServer(async (request, response) => {
  try {
    const rawPath = decodeURIComponent((request.url ?? "/").split("?")[0]);
    const relative = normalize(rawPath === "/" ? "index.html" : rawPath.replace(/^\/+/, ""));
    let file = resolve(join(root, relative));
    if (!file.startsWith(root)) throw new Error("Invalid path");
    const info = await stat(file);
    if (info.isDirectory()) file = join(file, "index.html");
    response.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream" });
    createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    createReadStream(join(root, "404.html")).pipe(response);
  }
});
server.listen(port, "127.0.0.1", () => console.log(`Serving ${root} at http://127.0.0.1:${port}`));
