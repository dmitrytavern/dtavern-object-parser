# .isSchema(object)

Returns `true`, if the object is a [Schema](../types/schema.md) object, otherwise returns `false`.

- `object` - an any object.

## General usage

```javascript
const rawSchema = { a: String }

const schema = parser.schema(rawSchema)

parser.isSchema(rawSchema)
// => false

parser.isSchema(schema)
// => true
```
