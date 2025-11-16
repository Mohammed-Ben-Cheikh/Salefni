import jsonServer from "json-server";

const server = jsonServer.create();
const router = jsonServer.router("./api/db.json");
const middlewares = jsonServer.defaults();

// Middleware pour ajouter des timestamps automatiques
server.use((req, res, next) => {
  if (req.method === "POST") {
    req.body.createdAt = new Date().toISOString();
    req.body.updatedAt = new Date().toISOString();
  }
  if (req.method === "PUT" || req.method === "PATCH") {
    req.body.updatedAt = new Date().toISOString();
  }
  next();
});

server.use(middlewares);
server.use("/api", router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
