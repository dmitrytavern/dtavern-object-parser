# .isProperty(object)

Returns `true`, if the object is a [PropertySchema](../types/property-schema.md) object, otherwise returns `false`.

- `object` - an any object.

## General usage

```javascript
const propertyOptions = { type: String }

const propertySchema = parser.property(propertyOptions)

parser.isProperty(propertyOptions)
// => false

parser.isProperty(propertySchema)
// => true
```
