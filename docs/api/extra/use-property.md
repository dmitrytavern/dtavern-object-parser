# .useProperty(object)

Safe usage of a property schema. If the object is a property schema, return it, otherwise calls [.property()](../property.md).

- `object` - a [PropertySchema](../types/property-schema.md) or a [PropertySchemaRaw](../types/property-schema-raw.md) object.

## General usage

```javascript
const options = { type: String }

const schema = parser.property(options)

parser.useProperty(options)
parser.useProperty(schema)
// => returns equal schemas
```

:::warning
In this example, the schemas are identical in properties, but **they refer to different addresses in memory**. Therefore, they are **not completely identical**. Be careful not to cause a memory leak.
:::

## Error handling

All errors can be from [.property()](../property.md).
