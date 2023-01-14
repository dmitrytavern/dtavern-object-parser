# What is ObjectParser?

A simple and easy way to check and parse an object without pain.

::: warning
ObjectParser **is currently untested** on all platforms, all versions of node.js, and all browsers. The library is written without external dependencies and in general, it is implemented quite simply and has testing, so if you have any problems, open an [issue](https://github.com/dmitrytavern/object-parser/issues/new).
:::

## Motivation

Every time I start writing code for a new library or project, I have one problem - checking the properties of an object for validity.

For example, a new library that has functions where the arguments are complex objects. Writing an implementation of object validation every time is depressing. Or working with the API of a third-party service over which there is no control. If the service changes its API, the problem will be difficult to detect immediately, especially if there are many such projects and there is simply no time to work simultaneously.

And, since I've had several commercial projects on Vue.js, I really liked the implementation of "props" in this framework. In my opinion, this implementation is much better than PropTypes in React.js.

Therefore, I decided to write my own implementation of Vue props, which could work in any conditions.

## Features

ObjectParser has the following features:

- **Ligth-weight**. ~7KiB in compressed without gzip and ~3KiB with.
- **Vue-like props**. Write schemas like Vue.js props.
- **Powerful property checker**. Use built-in types or own, set a default value and a custom validator (how in Vue.js).
- **TypeScript support**. ObjectParser has full and convenient typescript support. For more info, see [typescript support](./advanced/typescript.md).
- **Performance**. ObjectParser is fast. For more info, see [benchmarks](./advanced/benchmarks.md).
- **No dependencies**.

## Alternatives

Before writing the code, I decided to take a look at alternative solutions:

- **[joi](https://github.com/hapijs/joi)** - really powerful and cool library for validation and more. Perhaps the best solution. Of the nuances that I did not like:

  - **~150KiB** compressed! For Node.js, this is not a problem, but for browsers, this is a disastrous result.

- **[validate.js](https://github.com/ansman/validate.js)** - a very good library for object validation, and also with the ability to extend with your own validators. Of the nuances that I did not like:

  - The project no longer support.
  - Missing default setter implementation.
  - You need to write your own implementation for array validation and property validation for several types.

## Future

I do not plan to abandon the development and I have a few ideas for implementation:

- Improve performance, and optimize typing.
- Add **readonly** option to .parse() function.
- Add other libraries to benchmarks
- Reduce assembly weight.

I also want to improve documentation, tests and CI.
