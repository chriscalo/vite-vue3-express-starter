import { spawn, spawnSync } from "node:child_process";
import toThenable from "2-thenable";
import { reverse, map } from "ramda";
import { asyncPipe } from "./async.js";
import { cjsify } from "./module.js";

const { require } = cjsify(import.meta);

// TODO: patch the kill() method on the child process object returned
export function run(command, args = [], options = {}) {
  if (typeof command === "string") {
    const WHITESPACE = /\s+/;
    command = command.split(WHITESPACE);
  }
  
  if (typeof args === "string") {
    const WHITESPACE = /\s+/;
    args = args.split(WHITESPACE);
  }
  
  // combine command and args, then command is the first item, args are the rest
  [ command, ...args ] = [...command, ...args];
  
  const {
    sync = false,
    input = true,
    ...runOptions
  } = {
    env: {
      ...process.env,
      FORCE_COLOR: true,
    },
    ...options,
  };
  
  runOptions.stdio = [
    input ? "inherit" : "ignore", // stdin
    "pipe", // stdout
    "pipe", // stderr
  ];
  
  const run = sync ? runSync : runAsync;
  return run(command, args, runOptions);
};

function runSync(command, args, options) {
  const { status, stdout, stderr } = spawnSync(command, args, options);
  
  // TODO: throw if status is non-zero?
  return {
    code: status,
    stdout: String(stdout),
    stderr: String(stderr),
  };
}

function runAsync(command, args, options) {
  let stdout = "";
  let stderr = "";
  
  const child = spawn(command, args, options);
  
  child.terminate = function terminate() {
    this.stdout.unpipe(process.stdout);
    this.stderr.unpipe(process.stderr);
    
    const running = this.exitCode === null;
    
    if (running) {
      return new Promise(async resolve => {
        this.on("exit", resolve);
        killTree(this.pid);
      });
    } else {
      return Promise.resolve();
    }
  };
  
  if (child.stdout) {
    child.stdout.setEncoding("utf-8");
    child.stdout.on("data", data => stdout += data);
    child.stdout.pipe(process.stdout);
  }
  
  if (child.stderr) {  
    child.stderr.setEncoding("utf-8");
    child.stderr.on("data", data => stderr += data);
    child.stderr.pipe(process.stderr);
  }
  
  return toThenable(child, new Promise((resolve, reject) => {
    child.on("close", (code, signal) => {
      const result = {
        code,
        signal,
        stdout,
        stderr,
      };
      
      // TODO: throw if code is non-zero?
      resolve(result);
    })
    child.on("error", reject);
  }));
}

async function killTree(pid) {
  const kill = require("tree-kill");
  const pidtree = require("pidtree");
  
  return await asyncPipe(
    () => pidtree(pid, { advanced: true, root: true }),
    reverse(), // kill child processes first
    map(process => process.pid),
    map(pid => killPromisified(pid)),
    promises => Promise.all(promises),
  )();
  
  function killPromisified(pid) {
    return new Promise(resolve => kill(pid, "SIGTERM", resolve));
  }
}
