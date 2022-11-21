import express from "express";
import nocache from "nocache";

const middleware = express();
export default middleware;

middleware.set("json spaces", 2);
middleware.use(nocache());

middleware.get("/api", (req, res) => {
  const name = req.query.name ?? "friend";
  res.json({
    message: `Hello, ${name}!`,
    status: "OK",
  });
});
