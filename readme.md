# **JavaScript Object Praser**

<a href="https://www.npmjs.com/package/@dtavern/object-parser">
  <img loading="lazy" src="https://badgen.net/npm/v/@dtavern/object-parser" alt="Version" />
</a>
<a href="https://github.com/dmitrytavern/dtavern-object-parser">
  <img loading="lazy" src="https://badgen.net/github/last-commit/dmitrytavern/dtavern-object-parser" alt="Last commit">
</a>
<a href="https://github.com/dmitrytavern/dtavern-object-parser">
  <img loading="lazy" src="https://badgen.net/github/license/dmitrytavern/dtavern-object-parser" alt="License">
</a>

A simple and easy way to check and parse an object without pain with next features:

- Check a property types
- Check a property existence
- Default value setter
- Custom validator
- No dependencies

## A quick example

```javascript
import parser from '@dtavern/object-parser'

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

ObjectParser is available via [npm](https://www.npmjs.com/package/@dtavern/object-parser):

```
npm install --save @dtavern/object-parser
```

Browser/CDN:

```html
<script src="https://unpkg.com/@dtavern/object-parser@2.0.0/dist/object-parser.min.js"></script>
```

## Usage

CommonJS:

```javascript
const parser = require('@dtavern/object-parser')
const { parser } = require('@dtavern/object-parser')
const { parse, schema, property } = require('@dtavern/object-parser')
```

ES6:

```javascript
import parser from '@dtavern/object-parser'
import { parser } from '@dtavern/object-parser'
import { parse, schema, property } from '@dtavern/object-parser'
```

Browser:

```html
<script>
  const parser = window.objectParser
  const { parser } = window.objectParser
  const { parse, schema, property } = window.objectParser
</script>
```

You can use the style you prefer. For more information, see [docs](https://dmitrytavern.github.io/dtavern-object-parser/guide/installation).

## Documentation

Powerful documentation can be found at [dmitrytavern.github.io/dtavern-object-parser](https://dmitrytavern.github.io/dtavern-object-parser/).

## License

MIT - check repo files

Copyright (c) 2022-present, Dmitry Tavern
