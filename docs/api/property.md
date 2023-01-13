# .property([options])

Creates a property schema.

- `options` - can be null, undefined or an object with next options:

  - `type` - describe a property type.

    - Type: [Constructor](./types/constructor.md) | [Constructor[]](./types/constructor.md)
    - Default: `[]`

  - `element` - describe a schema of array elements (if the type and the property is `Array`).

    - Type: `null` | [Constructor](./types/constructor.md) | [Constructor[]](./types/constructor.md) | [Schema](./types/schema.md) | [PropertySchema](./types/property-schema.md)
    - Default: `null`

  - `required` - describe a property requirement in an object.

    - Type: `boolean`
    - Default: `true`

  - `default` - describe a property default value. Note: objects and arrays must be returned by a function.

    - Type: `any`
    - Default: `null`

  - `validator` - describe a property custom validator.

    - Type: `Function`
    - Default: `null`

  - `skipDefaultValidate` - if true, the custom validator doesn't call when the value is the default.

    - Type: `boolean`
    - Default: `false`

## General usage

```javascript
parser.property(null)
parser.property(undefined)
parser.property({})
// => the property must exist and value can have any type

parser.property({ type: String })
// => the property must exist and value must be a string

parser.property({ type: [String, Boolean] })
// => the property must exist and value must be a string or a boolean

parser.property({ type: Array, element: String })
// => the property must exist and value must be an array of strings

parser.property({ required: false })
// => the property is not required and value can have any type

parser.property({ required: false, default: 'Hello World' })
// => the property is not required
// => the value can have any type
// => if the property not exists - sets the default value

parser.property({ validator: (val) => val === 'Hello World' })
// => the property must exist
// => the value can have any type
// => the value must pass the custom validator

parser.property({
  default: '',
  required: false,
  skipDefaultValidate: true,
  validator: (val) => val === 'Hello World',
})
// => the property is not required
// => the value can have any type
// => the value must pass the custom validator
// => if the property not exists - sets the default value
// => if the value is the default - ignore the custom validator
```

## Error handling

If the options have an error - it will throw an exception:

```javascript
const otherSchema = parser.schema()
const otherPropertySchema = parser.property()
parser.property(otherSchema)
parser.property(otherPropertySchema)
// => throws: the argument can't be a schema

parser.property({ a: String })
// => throws: not allowed key

parser.property({ type: ['somevalue'] })
// => throws: type must be a function or an array of functions

parser.property({ default: [] })
parser.property({ type: [String, Object], default: '' })
// => throws: default must be a function because the type contains no primitive types

parser.property({ validator: 'somevalue' })
// => throws: validator must be a function

parser.property({ element: String })
// => throws: element must be null, because type is not an array type
```
