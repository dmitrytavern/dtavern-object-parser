# PropertyError type

The property error. Keys:

- `name` - error name. See [.utils.Errors](../utilities/errors.md).
- `message` - error message.
- `exists` - if true, **a property has a value** from an object or it is **a default value**.
- `value` - **a property value** from an object or **a default value** from a property schema.
- `valueIsDefault` - if true, a property value is a default.
- `valueConstructors` - an array of value constructors. See [.utils.getConstructors()](../utilities/get-constructors.md).
- `schema` - a [PropertySchema](./property-schema.md) object which was used for parse.

Usage example:

```typescript
const obj: PropertyError = {
  name: 'PropertyError',
  message: 'The error message',
  exists: true,
  value: null,
  valueIsDefault: false,
  valueConstructors: [],
  schema: parser.property(null),
}
```
