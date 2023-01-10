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

A light-weight object parser with next features:

- Check the property types
- Check the property existence
- Default value setter
- Custom validator
- No dependencies

## A quick example

```javascript
import parser from '@dtavern/object-parser'

const objectSchema = parser.schema({
  name: String,

  age: Number,

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

const targetObject = { name: 'Dmitry', age: 19 }

const result = parser.parse(targetObject, objectSchema)
// => {
//   value: { name: 'Dmitry', age: 19, role: 'anonymous' }
//   errors: []
// }
```

What's going on here:

1. Imported parser.
2. Created the object schema where:
   - `name` - is required property which can be only String.
   - `age` - is required property which can be only Number.
   - `role` - is not required property, which can be only an "anonymous", "user" or "admin" string. Value by default: "anonymous".
3. Parsed the target object by the object schema.

The result of parsing is an object, where:

- `value` - parsed object. If your schema contains only required props, the `value` and the original object will be the same. Also, if you use the clone option, the value will be cloned object. See [.parse()](./docs/api/parse.md) docs.
- `errors` - array of errors. If the target object not conatains errors, the array will be empty.

## Installation

ObjectParser is available via [npm](https://www.npmjs.com/package/@dtavern/object-parser):

```
npm install --save @dtavern/object-parser
```

Browser/CDN:

```html
<script src="https://unpkg.com/@dtavern/object-parser@2.0.0/dist/object-parser.min.js"></script>
```

Also, you can download ObjectParser from [GitHub assets](https://github.com/dmitrytavern/dtavern-options/releases/tag/v2.0.0).

## Usage

CommonJS:

```javascript
const parser = require('@dtavern/object-parser')
const { parser } = require('@dtavern/object-parser')

// or

const { parse, schema, property } = require('@dtavern/object-parser')
```

ES6:

```javascript
import parser from '@dtavern/object-parser'
import { parser } from '@dtavern/object-parser'

// or

import { parse, schema, property } from '@dtavern/object-parser'
```

You can use the style you prefer.

## Documentation

Documentation can be found at [dmitrytavern.github.io/dtavern-object-parser](https://dmitrytavern.github.io/dtavern-object-parser/overview/getting-started.html).

## License

MIT - check repo files

Copyright (c) 2022-present, Dmitry Tavern
