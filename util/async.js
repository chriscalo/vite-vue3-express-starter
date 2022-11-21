
export class Deferred {
  #state = "pending";
  
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      
      this.resolve = (...args) => {
        if (this.#state === "pending") {
          resolve(...args);
          this.#state = "fulfilled";
        }
      };
      
      this.reject = (...args) => {
        if (this.#state === "pending") {
          reject(...args);
          this.#state = "rejected";
        }
      };
      
    });
  }
  
  get state() {
    return this.#state;
  }
  
  then(fn) {
    return this.promise.then(fn);
  }
};

export function asyncPipe(...fns) {
  return async function (value) {
    value = await value;
    for (const fn of fns) {
      value = await fn(value);
    }
    return value;
  };
};
