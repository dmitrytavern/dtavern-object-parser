# RawSchema type

The raw schema for describing handled schema. This type allows using more types to describe a schema.

Example for an object:

```typescript
const obj: RawSchema = {
  a1: String,
  b1: [String, Number],
  c1: {
    a2: Number,
    b2: createPropertySchema(null),
    c2: null,
  },
}
```

Example for an array:

```typescript
const arr: RawSchema = ['c1', 'b1', 'a1.a2.a3']
```
