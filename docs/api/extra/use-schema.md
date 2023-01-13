# .useSchema(object)

Safe usage of an object schema. If the object is schema, return it, otherwise calls [.schema()](../schema.md).

- `object` - a [Schema](../types/schema.md) or an [RawSchema](../types/raw-schema.md).

## General usage

```javascript
const rawSchema = { a: String }

const schema = parser.schema(a)

parser.useSchema(a)
parser.useSchema(schema)
// => returns equal schemas
```

:::warning
In this example, the schemas are identical in properties, but **they refer to different addresses in memory**. Therefore, they are **not completely identical**. Be careful not to cause a memory leak.
:::

## Error handling

All errors can be from [.schema()](../schema.md).
