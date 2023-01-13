# RawSchemaProperty type

Property type of a [RawSchema](./raw-schema.md) object if a [Schema](./schema.md) is an object.

Usage example:

```typescript
const obj_1: RawSchemaProperty = null
const obj_2: RawSchemaProperty = String
const obj_3: RawSchemaProperty = [String, Number]
const obj_4: RawSchemaProperty = parser.property(null)
const obj_5: RawSchemaProperty = {
  a: obj_1,
  b: obj_2,
}
```
