# **Type upcasting**

In js **everything is an object**. More precisely, all primitives (except null and undefined) are inherited from their constructors, and they from the Object. For example:

```javascript
const str = 'Hello World'
// is a primitive variable inherited from String
// String inherited from Object
```

**Constructors are used as the type** for object properties in the ObjectParser, and the property type checker works by splitting the value into constructors and comparing them.

Example:

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

This feature allows upcasting of types.

Example:

```javascript
class Animal {}
class Bunny extends Animal {}
class WhiteBunny extends Bunny {}

const animal = new Animal()
const bunny = new Bunny()
const whiteBunny = new WhiteBunny()

parser.parse(
  {
    animal: animal,
    bunnyAnimal: bunny,
    whiteBunnyAnimal: whiteBunny,
  },
  {
    animal: Animal,
    bunnyAnimal: Animal,
    whiteBunnyAnimal: Animal,
  }
)
// => {
//   value: {
//     animal: animal (as Animal),
//     bunnyAnimal: bunny (as Animal),
//     whiteBunnyAnimal: whiteBunny (as Animal),
//   },
//   errors: []
// }
```

Of course, this does not change the object in any way. This functionality is more likely to support typescript.

But it is important to consider if you are using the `Object` type because it means **any** type (except null and undefined).

Example:

```javascript
parser.parse(
  {
    a: 'hello world',
    b: false,
    c: {},
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
//     b: false (as any),
//     c: {} (as any),
//   },
//   errors: []
// }
```
