export interface JamaRESTAPISpec {
	setItemId: number;

	endpointTagsFolderId: number;
	endpointTags: JamaRESTAPIEndpointTag[];

	dataTypesFolderId: number;
	dataTypes: JamaRESTAPIDataType[];
}

export interface JamaRESTAPIEndpointTag {
	action: JamaRESTAPIAction;
	folderId: number;
	name: string;
	endpoints: JamaRESTAPIEndpoint[];
}

export interface JamaRESTAPIEndpoint {
	action: JamaRESTAPIAction;
	specItemId: number;
	title: string;
	description: string;
	examples: JamaRESTAPIExample[];
}

export interface JamaRESTAPIDataType {
	action: JamaRESTAPIAction;
	specItemId: number;
	title: string;
	description: string;
	examples: JamaRESTAPIExample[];
}

export interface JamaRESTAPIExample {
	action: JamaRESTAPIAction;
	textId: number;
	title: string;
	description: string;
}

export enum JamaRESTAPIAction {
	Create = 'Create',
	Update = 'Update',
	Delete = 'Delete'
}
