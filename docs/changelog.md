# Changelog

## v2.0.0

The main goal of this release is to add the ability to validate nested objects. However, almost everything had to be rewritten in the process. From new:

- **Updated public API** - core functions have been added for schema generation and asynchronous parsing, and the old main function has been changed. Utilities for specific use have also been added.
- **Add support nested objects** - a new way of creating schemas, as well as a modified parsing algorithm, made it possible to parse nested objects.
- **Improve typescript support** - more complex typing now allows you to determine the type of an object and its properties by schema type.
- **Improve documentation** - added a vitepress static site generator for documentation, as well as a fully described public API of the library, with all examples and a detailed description of the use.

**BREAKING CHANGE:** defineOptions function deleted. Use .parse().

## v1.1.0

- Fixed the bug with async functions.
- Add keys checker for a property schema settings.

## v1.0.1

- Added metadata to the package.

## v1.0.0

Initial release.
