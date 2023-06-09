# Changelog

## v2.0.2

This patch fixes typing problems. From the updated:

- Added readonly flags to library schemas to prevent them from being edited at the type level.

## v2.0.1

This patch fixes the following problem:

- When specifying `required: false` and `default` options for a property schema, after parsing, the returned value type does not contain the **undefined** type.
- Updated generics for `PropertySchema`, `PropertySchemaRaw` types and `.createPropertySchema()`, `.usePropertySchema()` functions.
- Added new types `PropertyDefaultRaw` and `PropertyDefaultNormalize`.
- Updated documentation for the patch. See:
  - [PropertySchema](api/types/property-schema.md)
  - [PropertySchemaRaw](api/types/property-schema-raw.md)
  - [PropertySchemaReturn](api/types/property-schema-return.md)
  - [TypeScript Support](guide/advanced/typescript.md)

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
