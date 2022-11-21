import { cjsify } from "./module.js";

const { require } = cjsify(import.meta);

const PRODUCTION = process.env.NODE_ENV === "production";

export async function listen(app, port) {
  // this is slow, so only do it during local development
  if (!PRODUCTION) {
    await killPort(port);
  }
  return new Promise((resolve, reject) => {
    const listener = app.listen(port, "localhost", function () {
      const { port } = listener.address();
      const url = `http://localhost:${port}`;
      resolve({
        url,
        port,
      });
    });
  });
};

async function killPort(port) {
  const killPort_ = require("kill-port");
  return killPort_(port);
}
