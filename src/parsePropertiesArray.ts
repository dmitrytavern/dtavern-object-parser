export const parsePropertiesArray = <Properties>(
	properties: Properties,
	propertiesSettings: string[]
): Required<Properties> => {
	const errorPropertyKeys = []

	for (const propertyKey in properties) {
		const index = propertiesSettings.indexOf(propertyKey)

		if (index === -1) errorPropertyKeys.push(propertyKey)

		propertiesSettings.splice(index, 1)
	}

	if (propertiesSettings.length > 0) {
		const s = propertiesSettings.join(' | ')
		throw `options have no "${s}" properties`
	}

	if (errorPropertyKeys.length > 0) {
		const s = errorPropertyKeys.join(' | ')
		throw `properties "${s}" have not in the settings`
	}

	return properties as Required<Properties>
}
