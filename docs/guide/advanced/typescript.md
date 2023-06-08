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

## Default property

If `required: false` is present in the property schema, the future value will be of the **undefined** type. But if `default` exists, then **undefined** is cancelled. Example:

```typescript
const a = parser.property({
  type: Array,
  required: false,
  element: Number,
})

const b = parser.property({
  type: Array,
  required: false,
  element: Number,
  default: () => [1, 2, 3],
})

const schema = parser.schema({ a, b })

const { value } = parser.parse({}, schema)

// typeof value.a - number[] | undefined
// typeof value.b - number[]
```

This also works with array elements:

```typescript
const arrayElement = parser.property({
  type: Number,
  required: false,
  default: 0,
})

const a = parser.property({
  type: Array,
  element: arrayElement,
})

const schema = parser.schema({ a })

const { value } = parser.parse({}, schema)

// typeof value.a - number[]
```

## Complex structures

With these `.property()` and `.schema()` functions you can create complex and nested structures. However, there are some limitations.

Here is an example of incorrect use of functions:

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

An example of the correct use of functions:

```typescript
const a = parser.property({
  type: Array,
  required: false,
  element: Number,
})

const schema = parser.schema({ a })

const { value } = parser.parse({}, schema)

// typeof value.a - number[] | undefined
```

:::warning Warning!
Due to the specificity of typescript and my poor deep understanding of how typescript works, the two examples above, **while identical in functionality**, but **have a type difference** that can **be dangerous for your program**. Maybe this will be fixed in the future, or maybe I made a mistake somewhere.
:::

## Performance

Unfortunately, all this magic is not free. If you are dealing with complex and huge objects, which, in addition, have multidimensional arrays, **this can heavily load typescript**, which **will lead to lags in the interface** of your IDE. For now, I've noticed this in VS Code.
