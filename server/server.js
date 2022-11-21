import express from "express";
import { listen } from "~/util/index.js";
import uiMiddleware from "~/ui/index.js";
import apiMiddleware from "~/api/index.js";

const server = express();

server.use(uiMiddleware());
server.use(apiMiddleware());

const PORT = 8080;
const { url } = await listen(server, PORT); 
console.log(`App server running: ${url}`);
