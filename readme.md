# **JavaScript Object Praser**

<a href="https://www.npmjs.com/package/@dmitrytavern/object-parser">
  <img loading="lazy" src="https://badgen.net/npm/v/@dmitrytavern/object-parser" alt="Version" />
</a>
<a href="https://github.com/dmitrytavern/object-parser">
  <img loading="lazy" src="https://github.com/dmitrytavern/object-parser/actions/workflows/deploy.yml/badge.svg" />
</a>
<a href="https://github.com/dmitrytavern/object-parser">
  <img loading="lazy" src="https://badgen.net/github/last-commit/dmitrytavern/object-parser" alt="Last commit">
</a>
<a href="https://github.com/dmitrytavern/object-parser">
  <img loading="lazy" src="https://badgen.net/github/license/dmitrytavern/object-parser" alt="License">
</a>

`@dmitrytavern/object-parser` - is a library for object validation that takes the original object and its schema, and then checks all object properties for existence and typing, can call a custom validator and assign a default value.

The library **supports typescript** and has smart autocomplete for checked objects.

It has no external dependencies and weighs **~7KiB** compressed without gzip and **~3KiB** with.

## A quick example

```
npm install --save @dmitrytavern/object-parser
```

```javascript
import parser from '@dmitrytavern/object-parser'

const schema = parser.schema({
  name: String,
  age: [String, Number],
  role: parser.property({
    type: String,
    required: false,
    default: 'anonymous',
    validator: (value) => {
      if (!['anonymous', 'user', 'admin'].includes(value))
        throw new Error('Role must be "anonymous", "user" or "admin".')

      return true
    },
  }),
})

const target = { name: 'Dmitry', age: 19 }

const result = parser.parse(target, schema)
// => {
//   value: { name: 'Dmitry', age: 19, role: 'anonymous' }
//   errors: []
// }
```

**What's going on here:**

1. Imported parser.
2. Created the object schema where:
   - `name` - is required property which can be only String.
   - `age` - is required property which can be String or Number.
   - `role` - is not required property, which can be only an "anonymous", "user" or "admin" string. Value by default: "anonymous".
3. Parsed the target object by the object schema.

**The result of parsing is an object, where:**

- `value` - parsed object. By default is a reference on the original object.
- `errors` - array of errors. Сontains parsing errors.

## Installation

ObjectParser is available via [npm](https://www.npmjs.com/package/@dmitrytavern/object-parser):

```
npm install --save @dmitrytavern/object-parser
```

Browser/CDN:

```html
<script src="https://unpkg.com/@dmitrytavern/object-parser/dist/object-parser.min.js"></script>
```

## Usage

CommonJS:

```javascript
const parser = require('@dmitrytavern/object-parser')
const { parser } = require('@dmitrytavern/object-parser')
const { parse, schema, property } = require('@dmitrytavern/object-parser')
```

ES6:

```javascript
import parser from '@dmitrytavern/object-parser'
import { parser } from '@dmitrytavern/object-parser'
import { parse, schema, property } from '@dmitrytavern/object-parser'
```

Browser:

```html
<script>
  const parser = window.objectParser
  const { parser } = window.objectParser
  const { parse, schema, property } = window.objectParser
</script>
```

You can use the style you prefer. For more information, see [docs](https://dmitrytavern.github.io/object-parser/guide/installation).

## Documentation

Powerful documentation can be found at [dmitrytavern.github.io/object-parser](https://dmitrytavern.github.io/object-parser/).

## License

MIT - check repo files

Copyright (c) 2022-present, Dmitry Tavern
