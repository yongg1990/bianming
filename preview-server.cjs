const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "unpackage", "dist", "build", "prescription");
const fallback = path.join(root, "index.html");
const apiHost = "smadev.simmed.cn";
const server = http.createServer((req, res) => {
  let url = (req.url || "/").split("?")[0];
  if (url === "/api" || url.startsWith("/api/") || url === "/api2" || url.startsWith("/api2/")) {
    const headers = { ...req.headers, host: apiHost };
    delete headers.connection;
    const proxy = https.request({ hostname: apiHost, port: 443, path: req.url, method: req.method, headers }, (upstream) => {
      res.writeHead(upstream.statusCode || 502, upstream.headers);
      upstream.pipe(res);
    });
    proxy.on("error", () => {
      if (!res.headersSent) res.writeHead(502, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: { message: "API proxy unavailable" } }));
    });
    req.pipe(proxy);
    return;
  }
  if (url.startsWith("/prescription")) url = url.slice(13) || "/";
  let file = path.resolve(root, "." + url);
  if (!file.startsWith(root)) { res.statusCode = 403; return res.end("Forbidden"); }
  fs.stat(file, (statErr, stat) => {
    if (!statErr && stat.isDirectory()) file = path.join(file, "index.html");
    fs.readFile(file, (err, data) => {
      if (err) {
        fs.readFile(fallback, (fallbackErr, fallbackData) => {
          if (fallbackErr) { res.statusCode = 404; return res.end("Not found"); }
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(fallbackData);
        });
        return;
      }
      const ext = path.extname(file).toLowerCase();
      const types = { ".html": "text/html; charset=utf-8", ".js": "application/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".ico": "image/x-icon" };
      res.setHeader("Content-Type", types[ext] || "application/octet-stream");
      if (ext === ".html" && path.resolve(file) === path.resolve(fallback)) {
        data = Buffer.concat([data, Buffer.from('<script src="/prescription/static/js/prescription-table-override.js"></script>')]);
      }
      res.end(data);
    });
  });
});
server.listen(8080, "127.0.0.1");
