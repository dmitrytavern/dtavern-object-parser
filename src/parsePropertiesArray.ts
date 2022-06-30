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

	if (propertiesSettings.length > 0)
		throw new Error(`Have not "${propertiesSettings.join(' | ')}" properties`)

	if (errorPropertyKeys.length > 0)
		throw new Error(`Have not "${errorPropertyKeys.join(' | ')}" settings`)

	return properties as Required<Properties>
}
