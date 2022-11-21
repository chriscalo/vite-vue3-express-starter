import express from "express";
import nocache from "nocache";
import { run, cjsify, path } from "~/util/index.js";


const PRODUCTION = process.env.NODE_ENV === "production";
const { __dirname } = cjsify(import.meta);

export default uiMiddleware;

function uiMiddleware() {
  return (
    PRODUCTION ?
    [serveStatic()] :
    [devMiddleware(), serveStatic()]
  );
}

function devMiddleware() {
  // builds the UI in watch mode
  run("npm run build:dev", [], { cwd: __dirname });
  return nocache();
}

function serveStatic() {
  const distDir = path`${__dirname}/dist`;
  return express.static(distDir, {
    setHeaders(res, path, stat) {
      // don't cache any HTML files
      if (path.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    }
  });
}
