# .useSchema(object)

Safe usage of the schema. If the object is the schema, return it, otherwise calls [.schema()](./schema.md).

- `object` - can be a schema or an raw schema.

## General usage

```javascript
const rawSchema = { a: String }

const schema = parser.schema(a)

parser.useSchema(a)
parser.useSchema(schema)
// => returns equal schemas
// but not completely identical, be careful not to cause a memory leak
```

## Error handling

All errors can be from [.schema()](./schema.md).
