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
	Path = "path"
}

export interface OpenAPIRequestBody {
	description: string;
	required?: boolean;
	content: { [mediaType: string]: OpenAPIContent };
}

export interface OpenAPIResponse {
	description: string;
	content: { [mediaType: string]: OpenAPIContent };
}

export interface OpenAPIContent {
	schema: any;
	example: any;
}

export interface OpenAPIComponents {
	securitySchemes: { [key: string]: OpenAPISecuritySchema };
	schemas: { [key: string]: any };
}

export interface OpenAPISecuritySchema {
	type: string;
	scheme: string;
	bearerFormat?: string;
}

// TBD
export interface OpenAPISchema {

}

