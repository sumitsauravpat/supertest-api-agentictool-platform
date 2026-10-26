import http from "node:http";

// Purpose — a REAL, listening HTTP server standing in for the real promotions
// service, which another team is still building. Speaks the SAME real HTTP
// contract (status codes, JSON body) the real service will speak once it
// ships — so the client/test code never has to change, only the URL does.
export function startMockPromotionsServer(): Promise<{
  server: http.Server;
  url: string;
}> {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url ?? "", "http://localhost");
      const region = url.searchParams.get("region");

      res.setHeader("Content-Type", "application/json");

      if (region === "Ontario") {
        res.writeHead(200);
        res.end(JSON.stringify({ found: true, discountPercent: 15 }));
        return;
      }

      // Simulates the real service being down — lets QE validate error
      // handling BEFORE the real service can even produce this error itself.
      if (region === "ServerError") {
        res.writeHead(500);
        res.end(JSON.stringify({ message: "Internal Server Error" }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify({ found: false }));
    });

    server.listen(0, () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      resolve({ server, url: `http://localhost:${port}` });
    });
  });
}
