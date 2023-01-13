# Quick Start

ObjectParser is designed to guarantee the structure of the target object according to a certain scheme. This means that the parser will return an object with the properties specified in the schema. which:

- Will be of the specified type.
- Which will be checked for existence.
- Which will be checked by a custom validator.
- Which will have default values in case of absence.

Here is a example:

```javascript
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

const target = {
  name: 'Dmitry',
  age: 19,
}

parser.parse(target, schema)
// => {
//   value: { name: 'Dmitry', age: 19, role: 'anonymous' }
//   errors: []
// }
```

**What's going on here:**

1. Created the object schema where:
   - `name` - is required property which can be only String.
   - `age` - is required property which can be String or Number.
   - `role` - is not required property, which can be only an "anonymous", "user" or "admin" string. Value by default: "anonymous".
2. Parsed the target object by the object schema.

**The result of parsing is an object, where:**

- `value` - parsed object. By default **is a reference on the original object**.
- `errors` - an array of [GeneralError](../types/general-error.md).

## Error handling

If errors occur during parsing, they will be in `errors`, and the property itself will **not be changed**.

Example:

```javascript
const schema = parser.schema({
  name: String,
  age: [String, Number],
  role: parser.property({
    type: String,
    required: true,
    validator: (value) => {
      if (!['anonymous', 'user', 'admin'].includes(value))
        throw new Error('Role must be "anonymous", "user" or "admin".')
      return true
    },
  }),
})

parser.parse({ age: false, role: 'hello' }, schema)
// => {
//   value: { age: false, role: 'hello' },
//   errors: [
//     {
//       key: 'name',
//       error: {
//         name: 'PropertyError',
//         message: 'The property not exists in the object.',
//         exists: false,
//         value: undefined,
//         valueIsDefault: false,
//         valueConstructors: [],
//         schema: (a reference to a property schema)
//       }
//     },
//     {
//       key: 'age',
//       error: {
//         name: 'PropertyError',
//         message: 'The property has an invalid type.',
//         exists: true,
//         value: false,
//         valueIsDefault: false,
//         valueConstructors: [ [Function: Boolean], [Function: Object] ],
//         schema: (a reference to a property schema)
//       }
//     },
//     {
//       key: 'role',
//       error: {
//         name: 'PropertyError',
//         message: 'Role must be "anonymous", "user" or "admin".',
//         exists: true,
//         value: 'hello',
//         valueIsDefault: false,
//         valueConstructors: [ [Function: String], [Function: Object] ],
//         schema: (a reference to a property schema)
//       }
//     }
//   ],
// }
```

:::tip Note
The example above **shows only a part** of the possible errors that can occur during parsing. For more information about parsing see [.single()](../../api/single.md) or about an error see [PropertyError](../../api/types/property-error.md).
:::
