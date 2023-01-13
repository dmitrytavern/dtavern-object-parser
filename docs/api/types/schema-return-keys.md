# SchemaReturnKeys type

Returns keys of a [Schema](./schema.md) object.

```typescript
const obj = { a1: String, b1: { a2: [Number, Boolean] } }
type e = SchemaReturnKeys<Schema<typeof obj>>
// => ['a1', 'b1.a2']
```
