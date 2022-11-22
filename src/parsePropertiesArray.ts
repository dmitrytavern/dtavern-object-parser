export const parsePropertiesArray = <Props, Return = Required<Props>>(
	properties: Props,
	propertiesSchema: string[]
): Return => {
	const errorPropertyKeys = []

	for (const propertyKey in properties) {
		const index = propertiesSchema.indexOf(propertyKey)

		if (index === -1) errorPropertyKeys.push(propertyKey)

		propertiesSchema.splice(index, 1)
	}

	if (propertiesSchema.length > 0) {
		const s = propertiesSchema.join(' | ')
		throw `options "${s}" not found`
	}

	if (errorPropertyKeys.length > 0) {
		const s = errorPropertyKeys.join(' | ')
		throw `settings for "${s}" options not found`
	}

	// @ts-ignore
	return properties as Return
}
