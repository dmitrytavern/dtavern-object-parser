# PropertySchema type

Finished property schema for further parsing.

When you use functions for creating property schema, you transfer the [PropertySchemaRaw](./property-schema-raw.md) and get the **PropertySchema** type.

Generics: `<Type, ElementType, Required, Default>`.

Usage example:

```typescript
type CustomPropertyType = typeof Array[]
type CustomPropertyElement = PropertySchema<typeof String[]>
type CustomPropertyRequired = false
type CustomPropertyDefault = () => string[]

const schema_: PropertySchema<
  CustomPropertyType,
  CustomPropertyElement,
  CustomPropertyRequired,
  CustomPropertyDefault
> = parser.property({
  type: Array,
  required: false,
  default: () => ['khj'],
  element: parser.property({
    type: String,
  }),
})
// => {
//   type: [Array],
//   element: {
//     type: [String],
//     required: true,
//     default: null,
//     validator: null,
//     skipDefaultValidate: false,
//   },
//   required: false,
//   default: () => ['khj'],
//   validator: null,
//   skipDefaultValidate: false,
// }
```
