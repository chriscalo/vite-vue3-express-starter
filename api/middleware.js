import express from "express";
import nocache from "nocache";

const middleware = express();
export default middleware;

middleware.set("json spaces", 2);
middleware.use(nocache());

middleware.get("/api", (req, res) => {
  res.json({
    message: "Hi!",
    status: "OK",
  });
});
