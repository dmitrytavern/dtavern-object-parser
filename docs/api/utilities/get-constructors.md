# .utils.getConstructors(argument)

Returns an **array of constructors** by the object prototype hierarchy. See [Constructor[]](../types/constructor.md) type.

Usage example:

```javascript
getConstructors(null)
// => []

getConstructors(true)
// => [Boolean, Object]

getConstructors({})
// => [Object]

getConstructors([])
// => [Array, Object]

getConstructors(() => {})
// => [Function, Object]
```
