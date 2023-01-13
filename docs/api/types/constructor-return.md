# ConstructorReturn type

Constructor return type.

Usage example:

```typescript
class Animal {}

type StringType = typeof String
type AnimalType = typeof Animal
type TwoType = [StringType, AnimalType]

const var_1: ConstructorReturn<StringType> = 'str'
const var_2: ConstructorReturn<AnimalType> = new Animal()
const var_3: ConstructorReturn<TwoType> = 'str'
const var_4: ConstructorReturn<TwoType> = new Animal()
```
