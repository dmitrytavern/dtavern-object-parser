# .parse(object, schema, [options])

Parses the object by the schema. The main function of the package.

- `object` - parsing target. Can be `null`, `undefined` or `object`.
- `schema` - schema created via [.schema()](./schema.md) or raw `object`. Note: don't use raw schema, because every function call will re-create a schema.
- `[options]` - optional settings:
  - `clone` - when true, creates a new object and makes a deep clone of the original object. Note: default values from schema write to a new object and ignore the original object.

## General usage

```javascript
const object = { a: 'Hello World' }

const schema = parser.schema({ a: String })

parser.parse(object, schema)
// => {
//   value: { a: 'Hello World' },
//   errors: [],
// }
```

The result of parsing is an object with two properties:

- `value` - the original object if the clone is false or the cloned object if the clone is true.
- `errors` - the array with parse errors.

## Optional properties

When you use nested schema with optional properties, this function creates parent object automaticly.

```javascript
const object = { a: 'Hello World' }

const optionalPropertySchema = parser.property({ required: false })

const schema = parser.schema({
  a: optionalPropertySchema,
  b: {
    c: optionalPropertySchema,
  },
})

parser.parse(object, schema)
// => {
//   value: { a: 'Hello World', b: {} },
//   errors: [],
// }
```

## Clone object

If you don't need changes in the original object or you want to create a clone of the object, use the `clone` option. The function creates a new empty object and recursively copies properties from the original object to the new object.

With this setting, the original object will be read-only.

```javascript
const object = { a: { b: 'Hello World' } }

const schema = parser.schema({ a: { b: String } })

const result = parser.parse(object, schema, { clone: true })

delete result.value.a.b

console.log(result.value)
// => { a: {} }

console.log(object)
// => { a: { b: 'Hello World' } }
```

The function also can clone arrays:

```javascript
const object = { a: [1, 2, 3] }

const schema = parser.schema({ a: Array })

const result = parser.parse(object, schema, { clone: true })

result.value.a.push(4)

console.log(result.value)
// => { a: [ 1, 2, 3, 4 ] }

console.log(object)
// => { a: [ 1, 2, 3 ] }
```

And can even copy arrays with objects:

Note: if the property is an array and contains objects, the property schema must have the "element" key as a schema in property settings. Otherwise, array elements will be not cloned.

```javascript
const object = { a: [{ id: 1 }, { id: 2 }, { id: 3 }] }

const arrayElementSchema = parser.schema({ id: Number })

const schema = parser.schema({
  a: parser.property({
    type: Array,
    element: arrayElementSchema,
  }),
})

const result = parser.parse(object, schema, { clone: true })

result.value.a[0].id = 10

console.log(result.value)
// => { a: [ { id: 10 }, { id: 2 }, { id: 3 } ] }

console.log(object)
// => { a: [ { id: 1 }, { id: 2 }, { id: 3 } ] }
```

## Error handling

When the object has invalid properties, the array of errors will contain property errors. For more information on errors, see [.single()](./single.md).

```javascript
const schema = parser.schema({ a: String })

const result = parser.parse({}, schema)
// => {
//   value: {},
//   errors: [
//     {
//       key: 'a',
//       error: {
//         name: 'PropertyError',
//         message: 'The property not exists in the object',
//         exists: false,
//         value: undefined,
//         valueIsDefault: false,
//         valueConstructors: [],
//         schema: {
//           type: [ [Function: String] ],
//           element: null,
//           required: true,
//           default: null,
//           validator: null,
//           skipDefaultValidate: false
//         }
//       }
//     }
//   ]
// }
```
