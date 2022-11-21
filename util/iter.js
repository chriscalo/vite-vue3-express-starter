import { Repeater } from "@repeaterjs/repeater";

// Given an event emitter and event name, returns an async iterator of events.
export function fromEvent(emitter, event) {
  return new Repeater(async (push, stop) => {
    const on = (emitter.on ?? emitter.addEventListener).bind(emitter);
    const off = (emitter.off ?? emitter.removeEventListener).bind(emitter);
    
    on(event, listener);
    await stop;
    off(event, listener);
    
    function listener() {
      const [ first, ...rest ] = arguments;
      if (rest.length > 0) {
        push([first, ...rest]);
      } else {
        push(first);
      }
    }
  });
};

// Delays values from an async iterator until the `wait` time has passed.
// Accepts a `wait` time in milliseconds and returns a function that accepts an
// async iterator.
export function debounce(wait = 0) {
  if (typeof wait !== "number") throw new TypeError("wait must be a number");
  if (wait < 0) throw new RangeError("wait must be a non-negative number");
  
  return function (iterator) {
    return new Repeater(async (push, stop) => {
      let timeout = null;
      for await (const value of iterator) {
        clearTimeout(timeout);
        timeout = setTimeout(() => push(value), wait);
      }
    });
  }
};
