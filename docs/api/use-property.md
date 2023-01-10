# .useProperty(object)

Safe usage of the property schema. If the object is the property schema, return it, otherwise calls [.property()](./property.md).

- `object` - can be a property schema or options for a property schema creator.

## General usage

```javascript
const propertyOptions = { type: String }

const propertySchema = parser.property(propertyOptions)

parser.useSchema(propertyOptions)
parser.useSchema(propertySchema)
// => returns equal schemas
// but not completely identical, be careful not to cause a memory leak
```

## Error handling

All errors can be from [.property()](./property.md).
