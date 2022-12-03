import { isObject } from './objects'

const metadataName = '__dtavern_options_parser'

export const hasMetadata = (object: object) => {
	return isObject(object) && isObject(object[metadataName])
}

export const getMetadata = (object: object, key: string): any => {
	return object[metadataName][key]
}

export const setMetadata = (object: object, key: string, value: any): void => {
	if (!hasMetadata(object)) createMetadata(object)
	object[metadataName][key] = value
}

const createMetadata = (object: object): void => {
	Object.defineProperty(object, metadataName, {
		value: {},
		enumerable: false,
		writable: false,
	})
}
