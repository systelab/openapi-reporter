import { SpecEndpointData } from './spec-endpoint-data.model';
import { SpecModelData } from './spec-model-data.model';


export interface JamaRESTAPISpec {
	setId: number;
	specItemTypeId: number;

	endpointsFolderAction: JamaRESTAPIAction;
	endpointsFolderId: number;
	endpointGroups: JamaRESTAPIEndpointGroup[];

	dataTypesFolderAction: JamaRESTAPIAction;
	dataTypesFolderId: number;
	dataTypes: JamaRESTAPIDataType[];
}

export interface JamaRESTAPIEndpointGroup {
	action: JamaRESTAPIAction;
	folderId: number;
	name: string;
	endpoints: JamaRESTAPIEndpoint[];
}

export interface JamaRESTAPIEndpoint {
	action: JamaRESTAPIAction;
	specItemId: number;
	title: string;
	data: SpecEndpointData;
	description?: string;
	examples: JamaRESTAPIExample[];
}

export interface JamaRESTAPIDataType {
	action: JamaRESTAPIAction;
	specItemId: number;
	title: string;
	data: SpecModelData;
	description?: string;
	examples: JamaRESTAPIExample[];
}

export interface JamaRESTAPIExample {
	action: JamaRESTAPIAction;
	textItemId: number;
	title: string;
	description: string;
}

export enum JamaRESTAPIAction {
	NoAction = 'NoAction',
	Create = 'Create',
	Update = 'Update',
	Delete = 'Delete'
}
