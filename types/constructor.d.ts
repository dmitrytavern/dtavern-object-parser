export type Constructor<T> = ConstructorFunction<T> | ConstructorClass<T>

export type ArrayConstructorType = typeof Array | typeof Array[]

type ConstructorFunction<T> = { (): T }
type ConstructorClass<T> = { new (...args: any[]): T }

export type ConstructorReturn<Constructors> =
	Constructors extends Constructor<any>[]
		? ConstructorReturnTypes<Constructors>
		: ConstructorReturnType<Constructors>

type ConstructorReturnTypes<Constructors> =
	Constructors extends (infer Constructor)[]
		? ConstructorReturnType<Constructor>
		: never

type ConstructorReturnType<Constructor> =
	Constructor extends ConstructorClass<any>
		? InstanceType<Constructor>
		: Constructor extends (...args: any) => infer R
		? R
		: any
