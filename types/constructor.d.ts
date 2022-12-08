export type Constructor<T = any> = ConstructorFunction<T> | ConstructorClass<T>
export type ConstructorType = Constructor | Constructor[]
export type ArrayConstructorType = typeof Array | typeof Array[]

type ConstructorFunction<T = any> = { (): T }
type ConstructorClass<T = any> = { new (...args: any[]): T }

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
