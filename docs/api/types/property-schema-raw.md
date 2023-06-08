# PropertySchemaRaw type

For creating the [PropertySchema](./property-schema.md) object you need to pass some options to the create function. For this case use the **PropertySchemaRaw** object where all properties are not required, not readonly, and have `Raw` type versions.

Generics: `<TypeRaw, ElementTypeRaw, RequiredRaw, DefaultRaw>`.

Usage example:

```typescript
const rawSchema: PropertySchemaRaw<
  typeof Array,
  typeof String,
  false,
  () => string[]
> = {
  type: Array,
  element: String,
  required: false,
  default: () => ['red', 'blue'],
  validator: (val) => val.length > 0,
}
```
