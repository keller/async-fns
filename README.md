# Async Fns

Helper functions for asynchronous JavScript functions.

![licence](https://img.shields.io/npm/l/async-fns)
[![npm](https://img.shields.io/npm/v/async-fns)](https://www.npmjs.com/package/async-fns)
[![Build Status](https://travis-ci.org/keller/async-fns.svg?branch=master)](https://travis-ci.org/keller/async-fns)
[![Coverage Status](https://coveralls.io/repos/github/keller/async-fns/badge.svg?branch=master)](https://coveralls.io/github/keller/async-fns?branch=master)
![gzip size](https://img.badgesize.io/https://unpkg.com/async-fns/dist/index.js?compression=gzip)

## Motivation

I've created and compiled some functions for how I do asynchronous JavaScript. Asynchronous JavaScript is a powerful feature and shouldn't be hidden behind Async/Await to look like normal synchronous code. Promises are helpful but don't help much with control flow. Here are some functions to help with control flow of asynchronous code in JavaScript.

Please feel free to peak at the source code and just use the concepts in there instead of importing this library. The functions are small you and you can take the parts the are helpful and leave the parts that are not.

Slide Deck to come...

## Installation

```sh
npm install --save async-fns
```

or

```sh
yarn add async-fns
```

## Usage

Package is bundled in module, commonjs, and UMD formats. Each function is separated out into it's own module and can be included separately, or a single "tree shakable" module can be imported with all the functions.

These functions should work on all modern and recent browsers versions and node.js environments that support Promises or have a Promise Polyfill. The `run()` function will run a generator function so requires the JS environment to support [Generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) or compiled via [Babel](https://babeljs.io/) or [Regenerator](https://facebook.github.io/regenerator/).

### ES6 Modules

```js
// single import
import { sequence, emitter } from "async-fns";
// individual imports
import sequence from "async-fns/sequence";
import emitter from "async-fns/emitter";

// ...
```

### CommonJS

```js
// single import
const asyncFns = require("async-fns");
asyncFns.sequence(/*...*/);
const em = asyncFns.emitter();

// destructured import
const { sequence, emitter } = require("async-fns");
//...

// individual imports
const sequence = require("async-fns/sequence");
const emitter = require("async-fns/emitter");
// ...
```

### UMD

Can use requireJS, or any UMD or AMD loader; or download and use the script file in a `<script>`.

```html
<!-- combined file -->
<script src="https://unpkg.com/async-fns@0.11.0/dist/index.umd.js"></script>
<script>
  asyncFns.sequence(/*...*/);
</script>

<!-- individual file -->
<script src="https://unpkg.com/async-fns@0.11.0/sequence/dist/sequence.umd.js"></script>
<script>
  asyncFnsSequence(/*...*/);
</script>
```

## Functions

### `sequence(sequenceArray)` ![gzip size](https://img.badgesize.io/https://unpkg.com/async-fns/sequence/dist/sequence.js?compression=gzip)

- `@param {Array} sequenceArray` An array of functions or values.
- `@returns {Promise}` Promise that resolve to the return value of the last function in the array, or resolves to the last item in the array if not a function.

`sequence()` will call each function in the array and send the return value as the parameter to the next function. Functions that return promises will resolve the promise and send the resolved value as the parameter to the next function. If the item in the array is not a function, the value or resolved value will be passed to the next function. `sequence()` returns a promise that resolves with the return of the last function or the last value.

```js
import sequence from "async-fns/sequence";

sequence([
  fetch(`/api`),
  response => response.json(),
  data => {
    console.log(data.value);
  }
]);
```

#### `sequence.stop(returnValue)`

`sequence.stop()` is used to stop evaluating the array of functions. Future functions are not called and the value the entire `sequence()` will resolve with the value passed to `sequence.stop()`

```js
import sequence from "async-fns/sequence";

sequence([
  fetch(`/api/user`),
  response => response.json(),
  info => {
    if (info !== undefined) {
      return sequence.stop(info.userId);
    }
    return login(),
  },
  loginResponse => loginResponse.userId
]).then(userId => {
  console.log(userId);
});
```

#### `sequence.throw(error)`

`sequence.throw()` will also stop evaluating the array of functions, but instead of resolving to the value, the `sequence()` promise will reject with the error given.

```js
import sequence from "async-fns/sequence";

sequence([
  fetch(`/api/user`),
  response => response.json(),
  info => {
    if (data.info !== undefined) {
      return sequence.throw(`UNKNOWN_USER`);
    }
    console.log(`Welcome ${info.name}!`);
  }
]).catch(error => {
  console.error(`error: ${error}`);
});
```

### `race(raceArray)` ![gzip size](https://img.badgesize.io/https://unpkg.com/async-fns/race/dist/race.js?compression=gzip)

- `@param {Array} raceArray` An array of functions or values.
- `@returns {Promise}` An promise that resolves with an array with the same amount of elements as the input param "raceArray" with all values as undefined except the promise that resolved first.

This is similar to [Promise.race](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) with 2 main exceptions. In addition to promises, the array items can also be functions, and instead of resolving to single value, `race()` will resolve to an array. This can make it easier to know which promise resolved first.

```js
import race from "async-fns/race";

const cancelButton = () =>
  new Promise(resolve => {
    const click = () => {
      resolve();
      document.querySelector(`.cancel`).removeEventListener(`click`, click);
    };

    document.querySelector(`.cancel`).addEventListener(`click`, click);
  });
const timeout = () => new Promise(resolve => setTimeout(resolve, 5000));

race([cancelButton, timeout, getUser(userId)]).then(
  ([canceled, timedOut, userInfo]) => {
    if (canceled) {
      console.log(`Nevermind`);
    } else if (timedOut) {
      console.error(`Could not complete the request`);
    } else {
      console.log(`Hello ${userInfo.name}!`);
    }
  }
);
```

### Note on missing `parallel()`

I originally created a function to run functions in parallel, but realized it provided no advantages over [Promise.all()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all), so it was removed.

### `abortSignal({ signal }, abortableFunction?)` ![gzip size](https://img.badgesize.io/https://unpkg.com/async-fns/abortSignal/dist/abortSignal.js?compression=gzip)

- `@param {Object} options` An object with a attribute called "signal" and the value of an [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) object instance.
- `@param {Function} abortableFunction?` An optional function to make abortable
- `@return {Function}` wrapped function or Higher Order Function

`abortSignal()` is used to a function "abortable". It takes an abort signal and function and returns a new function that can be canceled by the via the [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) object. `abortSignal()` parameters are curried, so if now function is given, a Higher Order Function is returned that can create multiple wrapped abortable functions, with the same abortController object.

```js
import abortSignal from "async-fns/abortSignal";
import fetchUser from "./fetchUser";

const controller = new AbortController();
const abortableFetchUser = abortSignal(
  { signal: controller.signal },
  fetchUser
);

fetchUser(1)
  .then(userInfo => {
    console.log(`Hello ${userInfo.name}!`);
  })
  .catch(e => {
    console.error(`error: ${e.message}`);
  });

document.querySelector(".cancel").addEventListener(() => {
  controller.abort();
});
```

#### curried:

```js
import abortSignal from "async-fns/abortSignal";
import fetchUser from "./fetchUser";
import fetchFriends from "./fetchFriends";

const controller = new AbortController();
const withSignal = abortSignal({ signal: controller.signal });

const abortableFetchUser = withSignal(fetchUser);
const abortableFetchFriends = withSignal(fetchFriends);

abortableFetchUser(1)
  .then(userInfo => {
    console.log(`Hello ${userInfo.name}!`);
  })
  .catch(e => {
    console.error(`error: ${e.message}`);
  });

abortableFetchFriends(1)
  .then(friends => {
    console.log(`Friends Received.`);
  })
  .catch(e => {
    console.error(`error: ${e.message}`);
  });

document.querySelector(".cancel").addEventListener(() => {
  controller.abort();
});
```

### `aborter(emitter)` ![gzip size](https://img.badgesize.io/https://unpkg.com/async-fns/aborter/dist/aborter.js?compression=gzip)

- `@param {Object} emitter` [emitter](/#emitter-) object. See [emitter](/#emitter-) for more info
- `@return {Object}` object that can be used as an abort controller in `abortSignal()`

Since [abortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) is an "experimental technology" and not well supported as of 2019 in all browsers, `aborter()` can
be used instead in the above `abortSignal()`. It uses an [emitter](/#emitter-) instance object.

```js
import { abortSignal, aborter, emitter } from "async-fns";
import fetchUser from "./fetchUser";

const controller = aborter(emitter());
const abortableFetchUser = abortSignal(
  { signal: controller.signal },
  fetchUser
);

fetchUser(1)
  .then(userInfo => {
    console.log(`Hello ${userInfo.name}!`);
  })
  .catch(e => {
    console.error(`error: ${e.message}`);
  });

document.querySelector(".cancel").addEventListener(() => {
  controller.abort();
});
```

### `emitter()` ![gzip size](https://img.badgesize.io/https://unpkg.com/async-fns/emitter/dist/emitter.js?compression=gzip)

- `@return {Object}`
  - `subscribe {Function}` - function used to subscribe to emitter
  - `emit {Function}` - function used to emit events to all subscribers

`emitter()` is useful for managing async control when you want to listen to more than one event. Promises and functions that return promises are great for most a, but sometimes you want to listen to multiple events.

```js
import emitter from "async-fns/emitter";

const em = emitter();

const unsubscribe = em.subscribe("foo", payload => console.log("foo", payload));
const unsub2 = em.subscribe("*", (type, payload) => console.log(type, payload));

emitter.emit("foo", { val: 42 });

// unsubscribe listeners
unsubscribe();
unsub2();
```

### `run(genFunction)` ![gzip size](https://img.badgesize.io/https://unpkg.com/async-fns/run/dist/run.js?compression=gzip)

- `@param {function\*}` genFunction

`run()` will call a generator function and run the function. `yielding` promises will "pause" the function until the promise resolves and resume the function, evaluating the yielded expression with the value the promise resolved with. This can approximate some async/await behavior, but has a few advantages. It doesn't require async/await to be supported in the environment, only Generator Functions or code transpiled with [Regenerator](https://facebook.github.io/regenerator/) or Babel. I think it having it be a special function using `run()` should make writing code in an async/await style easy, but it not preferential to using `sequence()`, much of the time. The [code](blob/master/run/src/index.js) for `run()` is also very short and I think that is helpful to understand what is happening when using `run()` instead of just pretending async code is synchronous.

```js
import run from "async-fns/run";

const wait = () =>
  new Promise(resolve => setTimeout(() => resolve("done"), time));

run(function*() {
  try {
    const response = yield fetch(`/api`);
    const data = yield response.json();

    console.log(data.id);
  } catch (error) {
    console.error(error);
  }
});
```

### `channel(em)` ![gzip size](https://img.badgesize.io/https://unpkg.com/async-fns/channel/dist/channel.js?compression=gzip)

- `@param {Object} em` - an emitter instance
- `@return {Object}`
  - `take: {Function}` - waits for an event to come through in the channel and resolves with the data
  - `put: {Function}` - puts an event into the channel. `.put()` takes a single parameter as the data to send.

Channels are conceptually like a separate thread in your application that's solely responsible for side effects. You `take()` and `put()` data to the channel.

```js
import { emitter, channel, run } from "async-fns";

const wait = time => new Promise(resolve => setTimeout(resolve, time));
const chan = channel(emitter());

let pingpongs = 0;
function* pingpong(name) {
  if (name === "ping") {
    yield chan.put(name);
  }
  while (true) {
    const msg = yield chan.take();

    if (msg !== name) {
      pingpongs += 1;
      if (pingpongs > 10) {
        break;
      }

      console.log(msg);
      yield wait(10);
      yield chan.put(name);
    }
  }
}

run(pingpong, "ping");
run(pingpong, "pong");
```
