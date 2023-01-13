# SchemaReturn type

Returns final object type by a [Schema](./schema.md) object.

Usage example:

```typescript
const obj = { a1: String, b1: { a2: [Number, Boolean] } }
type return = SchemaReturn<Schema<typeof obj>>
// => {
//   a1: string,
//   b1: {
//     a2: number | boolean
//   }
// }
```
