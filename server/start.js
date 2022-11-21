import { run, cjsify, path } from "~/util/index.js";

const PRODUCTION = process.env.NODE_ENV === "production";
const { __dirname } = cjsify(import.meta);

const serverFile = path`${__dirname}/server.js`;

console.log("Starting app…");

const command = PRODUCTION ? 
  `npx node ${serverFile}` :
  `npx node --inspect --experimental-loader=hot-esm ${serverFile}`;

const runOptions = {
  cwd: path`${__dirname}/..`,
};

run(command, [], runOptions);
