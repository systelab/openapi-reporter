export class SpecEndpointPathParameter {
	name: string;
	description: string;
	type?: string;
}

export class SpecEndpointQueryString {
	name: string;
	description: string;
	type?: string;
	required: boolean;
	default?: string;
}

export class SpecEndpointRequestBody {
	description?: string;
	mediaType: string;
	modelId?: number;
	modelName?: string;
	example?: string;
}

export class SpecEndpointResponse {
	statusCode: number;
	description?: string;
	mediaType?: string;
	modelId?: number;
	modelName?: string;
	headers?: SpecEndpointResponseHeader[];
	example?: string;
}

export class SpecEndpointResponseHeader {
	name: string;
	description: string;
	type?: string;
}

export class SpecEndpointExample {
	id?: number;
	title: string;
	description: string;
}

export class SpecEndpointData {
	id?: number;
	method: string;
	url: string;
	groupName: string;
	summary: string;
	description?: string;
	pathParameters: SpecEndpointPathParameter[];
	queryStrings: SpecEndpointQueryString[];
	requestBody?: SpecEndpointRequestBody;
	responses: SpecEndpointResponse[];
	examples: SpecEndpointExample[];
	collapsed: boolean;
}

