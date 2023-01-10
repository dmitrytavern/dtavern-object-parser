# .utils.GeneratorFunction

The generator function constructor for a property schema types.

Example:

```javascript
parser.parse(
  {
    callback: function* () {
      yield i
      yield i + 10
    },
  },
  {
    callback: parser.utils.GeneratorFunction,
  }
)
// => callback property is valid
```
