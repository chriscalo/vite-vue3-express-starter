import { defineConfig } from "vite";
import { globbySync } from "globby";
import vue from "@vitejs/plugin-vue";
import { dirname, parse, join } from "node:path";
import { fileURLToPath } from "node:url";
import { path } from "~/util/index.js";

// Can't reference the variable `__dirname` because:
// 1. Node.js complains "__dirname is not defined in ES module scope."
// 2. Rollup will replace it with a static path string.
const filename__ = fileURLToPath(import.meta.url);
const dirname__ = dirname(filename__);
const PRODUCTION = process.env.NODE_ENV === "production";

export default defineConfig({
  appType: "mpa",
  resolve: {
    alias: {
      "~": path`${dirname__}/../`,
      "@": path`${dirname__}/./`,
    },
  },
  plugins: [
    vue(),
  ],
  build: {
    minify: PRODUCTION,
    rollupOptions: {
      input: htmlEntryPoints(),
    },
  },
});

function htmlEntryPoints() {
  const pattern = ["**/*.html", "!dist", "!node_modules"];
  const entries = globbySync(pattern).map(htmlFile => {
    const { dir, name } = parse(htmlFile);
    return [ join(dir, name), path`${dirname__}/${htmlFile}` ];
  });
  return Object.fromEntries(entries);
}
