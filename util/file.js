import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { performance } from "node:perf_hooks";
import { pipe } from "ramda";
import { cjsify } from "./module.js";
import { fromEvent, debounce } from "./iter.js";

const { require } = cjsify(import.meta);

export function watchFiles(options = {}) {
  const chokidar = require("chokidar");
  const caller = require("caller");
  
  const {
    event = "all",
    paths = ".",
    wait = 150,
    ...watcherOptions
  } = {
    cwd: dirname(fileURLToPath(caller())),
    ...options
  };
  
  const watcher = chokidar.watch(paths, watcherOptions);
  
  return pipe(
    watcher => fromEvent(watcher, event),
    changes => debounce(wait)(changes),
  )(watcher);
};

// tagged template function for ergonomically building paths
export function path(strings, ...values) {
  const maxLength = Math.max(strings.length, values.length);
  let parts = [];
  let i = 0;
  while (i < maxLength) {
    if (i < strings.length) parts.push(strings[i]);
    if (i < values.length) parts.push(values[i]);
    i++;
  }
  return join(...parts);
};
