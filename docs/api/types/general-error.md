# GeneralError type

The property error wrapper for the parser. Keys:

- `key` - key of invalid property.
- `error` - an error object. Can be [PropertyError](./property-error.md) or [ObjectError](./object-error.md).

Usage example:

```typescript
const obj: GeneralError = {
  key: 'propertyKey',
  error: {...}, // PropertyError or ObjectError
}
```
