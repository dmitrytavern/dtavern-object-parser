# .utils.getConstructors(argument)

Returns an array of constructors by the object prototype hierarchy.

Example:

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
