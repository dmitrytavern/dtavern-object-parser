# .single()

Parses the property from the object by the property schema. It checks property existence and type, calls a custom validator, and sets the default value.

The function uses overload and has 3-4 arguments.

Note: for examples in this file, the property schema creator is not used. But in production, use only the [.property()](./property.md) function to describe the property schema.

## .single(object, key, schema)

- `object` - the original object, which uses to read and write a property value.
- `key` - the property key.
- `schema` - the property schema or the raw property schema.

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

- `readonly` - the object to read a property value.
- `writable` - the object to write a property value.
- `key` - the property key.
- `schema` - the property schema or the raw property schema.

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

1. **The existence checker**. If the property is required and not exists - returns an error.

2. **The default setter**. If the property does not exist, set the default value (if exists).

3. **Type checker**. If the property exists (or the value is the default), and the type is not `any` - it compares value constructors with type. If no match is found - returns an error. Note: see [type upcasting](../overview/upcasting.md) for more information on how this checker works.

4. **Custom validator**. If the validator exists, the function calls it. If the validator throws or returns false - the function returns an error.

## Error handling

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

- `name` - the error name. See [.utils.Errors](./utils/errors.md).
- `message` - the error message.
- `exsists` - if true, the property has a value from the object or default value.
- `value` - the property value from the object or default value.
- `valueIsDefault` - if true, the property value is the default.
- `valueConstructors` - an array of value constructors. See [.utils.getConstructors()](./utils/get-constructors.md). Note: if a type in a schema is `any`, an array will be empty.
- `schema` - the property schema which was used for parse.
