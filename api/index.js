import { cjsify, watchFiles, Deferred } from "~/util/index.js";

const { __dirname } = cjsify(import.meta);
const PRODUCTION = process.env.NODE_ENV === "production";

export default apiMiddleware;

function apiMiddleware() {
  const loader = new ModuleLoader();
  loader.load();
  
  if (!PRODUCTION) {
    loader.watch();
  }
  
  return async function (req, res, next) {
    try {
      await loader.ready();
      const { handler } = loader;
      handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

class ModuleLoader {
  entryPointPath = "./middleware.js";
  #deferred = new Deferred();
  #handler = null;
  
  get handler() {
    return this.#handler;
  }
  
  async watch() {
    const changes = watchFiles({
      ignoreInitial: true,
    });
    
    for await (const change of changes) {
      await this.load();
    }
  }
  
  async load() {
    console.log("[API] Loading…");
    
    const previousDeferred = this.#deferred;
    const deferred = this.#deferred = new Deferred();
    deferred.then(previousDeferred.resolve);
    
    const { entryPointPath } = this;
    
    const module = await import(entryPointPath);
    deferred.resolve();
    this.#handler = module.default;
    console.log("[API] Ready.");
  }
  
  ready() {
    return this.#deferred.promise;
  }
}
