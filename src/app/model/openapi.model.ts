export interface OpenAPIDocument {
	openapi: string;
	info: OpenAPIInfo;
	servers: OpenAPIServer[];
	paths: { [key: string]: OpenAPIPath; };
	components: OpenAPIComponents;
}

export interface OpenAPIInfo {
	version: string;
	title: string;
	description: string;
}

export interface OpenAPIServer {
	url: string;
}

export interface OpenAPIPath {
	[method: string]: OpenAPIEndpoint;
}

export interface OpenAPIEndpoint {
	summary: string;
	tags: string[];
	security: any;
	parameters?: OpenAPIParameter[];
	requestBody?: OpenAPIRequestBody;
	responses: { [statusCode: string]: OpenAPIResponse; };
}

export interface OpenAPIParameter {
	in: OpenAPIParameterType;
	name: string;
	required: boolean;
	schema: any;
	description: string;
	example: any;
}

export enum OpenAPIParameterType {
	Path = "path",
	Query = "query"
}

export interface OpenAPIRequestBody {
	description: string;
	required?: boolean;
	schema?: any;
	content?: { [mediaType: string]: OpenAPIContent };
}

export interface OpenAPIResponse {
	description?: string;
	headers?: { [headerName: string]: OpenAPIHeader };
	content?: { [mediaType: string]: OpenAPIContent };
}

export interface OpenAPIHeader {
	description: string;
	schema: any;
}

export interface OpenAPIContent {
	schema: any;
	example: any;
}

export interface OpenAPIComponents {
	securitySchemes: { [key: string]: OpenAPISecuritySchema };
	schemas: { [key: string]: OpenAPISchema };
}

export interface OpenAPISecuritySchema {
	type: string;
	scheme: string;
	bearerFormat?: string;
}

export interface OpenAPISchema {
	type: string;
	description?: string;
	properties?: { [propertyName: string]: OpenAPISchemaProperty };
	required?: string[];
}

export interface OpenAPISchemaProperty {
	type?: string;
	items?: any;
	description?: string;
	ref?: any
}
