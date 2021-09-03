export interface TabData {
	id: string,
	label: string,
	isActive: boolean,
	disabled: boolean
}

export interface TabsData {
	[key: string]: TabData
}
