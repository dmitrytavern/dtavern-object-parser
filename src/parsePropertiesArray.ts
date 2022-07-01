export const parsePropertiesArray = <Props, Return = Required<Props>>(
	properties: Props,
	propertiesSettings: string[]
): Return => {
	const errorPropertyKeys = []

	for (const propertyKey in properties) {
		const index = propertiesSettings.indexOf(propertyKey)

		if (index === -1) errorPropertyKeys.push(propertyKey)

		propertiesSettings.splice(index, 1)
	}

	if (propertiesSettings.length > 0) {
		const s = propertiesSettings.join(' | ')
		throw `options "${s}" not found`
	}

	if (errorPropertyKeys.length > 0) {
		const s = errorPropertyKeys.join(' | ')
		throw `settings for "${s}" options not found`
	}

	// @ts-ignore
	return properties as Return
}
