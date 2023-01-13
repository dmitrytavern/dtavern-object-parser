# Schema type

Finished schema for further use in object parsing.

When you use functions for creating schema, you transfer the [RawSchema](./raw-schema.md) to options and get the **Schema** type which building by the raw schema.

Usage example:

```typescript
const obj = { a1: String, b1: { a2: [Number, Boolean] } }
const schema: Schema<typeof obj> = parser.schema({
  a1: String,
  b1: {
    a2: [Number, Boolean],
  },
})
// => {
//   a1: PropertySchema<StringConstructor[]>,
//   b1: {
//     a2: PropertySchema<(NumberConstructor | BooleanConstructor)[]>
//   }
// }
```

:::info Note
If you use an array as [RawSchema](./raw-schema.md), you get default **Schema** type. Currently, the **array type is not supported**.
:::
