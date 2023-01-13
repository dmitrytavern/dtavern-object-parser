# Typescript support

One of the main features of ObjectParser is **TypeScript support**. The idea is for the code to describe the type that the parser returns.

Simple example:

```typescript
const property = parser.property({
  type: Array,
  required: false,
  element: Number,
})

const schema = parser.schema({
  a: String,
  b: [String, Boolean],
  c: {
    d: property,
  },
})

const { value } = parser.parse({}, schema)

// typeof value.a - string
// typeof value.b - string | boolean
// typeof value.c - { d: number[] | undefined }
// typeof value.c.d - number[] | undefined
```

The example above demonstrates what type the parsing result is returned with. **Typing is completely based on the scheme**, which does not require additional writing of interfaces.

This feature is optional and is needed for the convenience of using the library.

## Complex structures

Not correct:

```typescript
const schema = parser.schema({
  a: parser.property({
    type: Array,
    required: false,
    element: Number,
  }),
})

const { value } = parser.parse({}, schema)

// typeof value.a - number[]
```

Correct:

```typescript
const property = parser.property({
  type: Array,
  required: false,
  element: Number,
})

const schema = parser.schema({
  a: property,
})

const { value } = parser.parse({}, schema)

// typeof value.a - number[] | undefined
```

:::warning Warning!
Due to the specificity of typescript and my poor deep understanding of how typescript works, the two examples above, **while identical in functionality**, but **have a type difference** that can **be dangerous for your program**. Maybe this will be fixed in the future, or maybe I made a mistake somewhere.
:::

## Performance

Unfortunately, all this magic is not free. If you are dealing with complex and huge objects, which, in addition, have multidimensional arrays, **this can heavily load typescript**, which **will lead to lags in the interface** of your IDE. For now, I've noticed this in VS Code.
