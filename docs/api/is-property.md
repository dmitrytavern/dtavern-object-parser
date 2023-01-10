# .isProperty(object)

Returns `true`, if the object is a property schema (not a schema), otherwise returns `false`.

- `object` - an any object

## General usage

```javascript
const propertyOptions = { type: String }

const propertySchema = parser.property(propertyOptions)

parser.isSchema(propertyOptions)
// => false

parser.isSchema(propertySchema)
// => true
```
