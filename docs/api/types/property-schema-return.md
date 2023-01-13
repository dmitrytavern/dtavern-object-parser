# PropertySchemaReturn type

Returns the property type by the [PropertySchema](./property-schema.md).

Usage example:

```typescript
// Get property type
type StringType = typeof String[]
type CustomProperty = PropertySchema<StringType>
const string: PropertySchemaReturn<CustomProperty> = 'str'

// Get property type as an array
type CustomPropertyType = typeof Array[]
type CustomPropertySchema = PropertySchema<typeof Number[], any, true>
type CustomPropertyRequired = true
type CustomProperty = PropertySchema<
  CustomPropertyType,
  CustomPropertySchema,
  CustomPropertyRequired
>
const array: PropertySchemaReturn<CustomProperty> = [1, 2, 3]
```
