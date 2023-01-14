# .single()

Parses the property from the object by the property schema.

The function uses overload and has 3-4 arguments.

:::info Note
For examples in this file, the property schema creator is not used. But in production, use only the [.property()](./property.md) function to describe the property schema.
:::

## .single(object, key, schema)

- `object` - an original object, which uses to read and write a property value.
- `key` - a [PropertyKey](./types/property-key.md) type.
- `schema` - a [PropertySchema](./types/property-schema.md) or a [PropertySchemaRaw](./types/property-schema-raw.md).

Usage:

```javascript
const object = { a: 'Hello World' }

parser.single(object, 'a', { type: String })
// => undefined
// object => { a: 'Hello World' }

parser.single(object, 'b', { required: false })
// => undefined
// object => { a: 'Hello World' }

parser.single(object, 'c', { required: false, default: 'World' })
// => undefined
// object => { a: 'Hello World', c: 'World' }
```

## .single(readonly, writable, key, schema)

- `readonly` - an object to read a property value.
- `writable` - an object to write a property value.
- `key` - a [PropertyKey](./types/property-key.md) type.
- `schema` - a [PropertySchema](./types/property-schema.md) or a [PropertySchemaRaw](./types/property-schema-raw.md).

Usage:

```javascript
const readonly = { a: 'Hello World' }
const writable = { a: 'Help me' }

parser.single(readonly, writable, 'a', { type: String })
// => undefined
// readonly => { a: 'Hello World' }
// writable => { a: 'Hello World' }

parser.single(readonly, writable, 'c', { required: false, default: 'World' })
// => undefined
// readonly => { a: 'Hello World' }
// writable => { a: 'Hello World', c: 'World' }
```

## How it's works

Firstly, the function defines **readonly**, **writable** objects, **key**, and **property schema** from arguments. If something is wrong - throws. Next, calls functions in this order:

1. **The existence checker**. Returns an error when a property is required and not exists.

2. **The default setter**. Sets a default value when a default setting exists and a property does not exist.

3. **Type checker**. Compares value type with a property type setting when a property exists (or a value is a default). If no match is found - returns an error.

4. **Custom validator**. Returns an error when a validator throws or returns false. If a validator is null - skip this function.

:::tip Note for type checker
See [type upcasting](../guide/advanced/types-upcasting.md) for more information on how this checker works.
:::

## Error handling

If a property is invalid, the function returns an error object. See [PropertyError](./types/property-error.md) type for more details.

```javascript
parser.single({}, 'a', { type: String })
// => {
//   name: 'PropertyError',
//   message: 'The property not exists in the object',
//   exists: false,
//   value: undefined,
//   valueIsDefault: false,
//   valueConstructors: [],
//   schema: {
//     type: [ [Function: String] ],
//     element: null,
//     required: true,
//     default: null,
//     validator: null,
//     skipDefaultValidate: false
//   }
// }
```

:::tip Note
If a type in a schema is **any**, an array of `valueConstructors` will be empty.
:::
