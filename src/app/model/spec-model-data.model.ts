export class SpecModelData {
	id?: number;
	name: string;
	description?: string;
	properties: SpecModelProperty[];
	collapsed: boolean;
}

export class SpecModelProperty {
	name: string;
	typeId?: number;
	typeName: string;
	typeBasic: boolean;
	typeArray: boolean;
	description: string;
}
