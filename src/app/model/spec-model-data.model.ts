export class SpecModelData {
	id?: number;
	name: string;
	description?: string;
	properties: SpecModelProperty[];
}

export class SpecModelProperty {
	name: string;
	typeId?: number;
	typeName: string;
	typeBasic: boolean;
	typeArray: boolean;
	description: string;
}
