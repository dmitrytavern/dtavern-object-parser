interface Properties {
	[key: string]: any
}

export const verifyPropertiesExists = (
	properties: Properties,
	settings: string[]
) => {
	for (const propertyKey in properties) {
		const index = settings.indexOf(propertyKey)

		if (index === -1)
			throw new Error(`Property "${propertyKey}" not exists in your settings`)

		settings.splice(index, 1)
	}

	if (settings.length > 0)
		throw new Error(`You have not "${settings.join(' | ')}" properties`)

	return true
}
