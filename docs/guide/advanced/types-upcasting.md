# Types upcasting

ObjectParser uses constructors for type comparison. For example, a string in JavaScript inherits from `String`, which inherits from `Object`. Thus, we can say that **everything in JavaScript is an object** (except `null` and `undefined`).

Here are some more examples:

```javascript
const str = 'Hello World'
// Consturctors: String, Object

const bool = true
// Consturctors: Boolean, Object

function fn() {}
// Consturctors: Function, Object

class Animal {}
const animal = new Animal()
// Consturctors: Animal, Object
```

**This is how type checking is built**, first get the inheritance hierarchy of the target value and look for matches. This allows you to cast child classes to the parent.

For example, this code is valid:

```javascript
class Animal {}
class Bunny extends Animal {}
class WhiteBunny extends Bunny {}

parser.parse(
  {
    animal: new Animal(),
    bunnyAnimal: new Bunny(),
    whiteBunnyAnimal: new WhiteBunny(),
  },
  {
    animal: Animal,
    bunnyAnimal: Animal,
    whiteBunnyAnimal: Animal,
  }
)
// => {
//   value: {
//     animal: instance of Animal (as Animal),
//     bunnyAnimal: instance of Bunny (as Animal),
//     whiteBunnyAnimal: instance of WhiteBunny (as Animal),
//   },
//   errors: []
// }
```

Of course, **this does not change the object in any way**. This functionality is more likely to support typescript.

But it is important to consider if you are using the `Object` type because it means **any** type (except `null` and `undefined`).

Example:

```javascript
parser.parse(
  {
    a: 'hello world',
    b: {},
    c: () => {},
  },
  {
    a: Object,
    b: Object,
    c: Object,
  }
)
// => {
//   value: {
//     a: 'hello world' (as any),
//     b: {} (as any),
//     c: () => {} (as any),
//   },
//   errors: []
// }
```

:::tip Recommendation
`Object` is recommended to use as type for values that can be anything expect null and undefined, because the **required** setting ensures that the key is assigned via **hasOwn()**.
:::
