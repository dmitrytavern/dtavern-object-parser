# .utils.GeneratorFunction

The generator function constructor for property schema types. [GeneratorFunctionConstructor](../types/generator-function-constructor.md).

Usage example:

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
// => a 'callback' property is valid
```
