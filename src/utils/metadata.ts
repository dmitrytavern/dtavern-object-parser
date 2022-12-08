import { isObject } from './objects'

const metadataName = '__dtavern_object_parser'

const hasMetadata = (object: any): boolean => {
	return isObject(object) && isObject(object[metadataName])
}

const getMetadata = (object: object, key: string): any => {
	if (!hasMetadata(object)) return undefined
	return object[metadataName][key]
}

const setMetadata = (object: object, key: string, value: any): void => {
	if (!hasMetadata(object)) defineMetadata(object)
	object[metadataName][key] = value
}

const deleteMetadata = (object: object): void => {
	if (hasMetadata(object)) delete object[metadataName]
}

const defineMetadata = (object: object): void => {
	Object.defineProperty(object, metadataName, {
		value: {},
		enumerable: false,
		writable: false,
		configurable: true,
	})
}

export const metadata = {
	has: hasMetadata,
	get: getMetadata,
	set: setMetadata,
	delete: deleteMetadata,
}
