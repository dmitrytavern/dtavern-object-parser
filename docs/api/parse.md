# .parse(object, schema, [options])

Parses the object by the schema. The core function of the package.

- `object` - parsing target. Can be `null`, `undefined` or `object`.
- `schema` - schema created via [.schema()](./schema.md) or raw `object`.
- `[options]` - optional settings:
  - `clone` - when true, creates a new object and makes a deep clone of the original object.

:::warning Warning!
Don't use a **raw object** for schema attribute in production, because every function call will re-create a schema and doesn't cache it. **It's very bad for performance**.
:::

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

- `value` - **a reference on original object** or **the cloned object** if the clone option is true.
- `errors` - an array of [GeneralError](./types/general-error.md).

## Nested optional properties

When you use nested schema with optional properties, this function creates parent object automaticly.

```javascript
const object = { a: 'Hello World' }

const optional = parser.property({ required: false })

const schema = parser.schema({
  a: optional,
  b: {
    c: {
      d: optional,
    },
  },
})

parser.parse(object, schema)
// => {
//   value: { a: 'Hello World', b: { c: {} } },
//   errors: [],
// }
```

## Cloning an object

If clone option is **true**, the function creates a new empty object and recursively copies properties from the original object to the new object. In this case, the original object will become **readonly**.

**Simple example with an object cloning:**

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

**Simple example with array cloning:**

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

**Harder example with cloning an array of objects:**

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

:::tip Note
If clone option is **true**, an original object becomes **readonly** and all default values will be put into the cloned object.
:::

:::tip Note
If the property is an array and contains objects, the property schema must have the **element** key as a schema in property settings. Otherwise, array elements will be not cloned.
:::

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
