import { Injectable } from '@angular/core';

import { SpecEndpointData, SpecEndpointPathParameter, SpecEndpointQueryString, SpecEndpointRequestBody, SpecEndpointResponse, SpecEndpointResponseHeader } from '@model';
import { OpenAPIEndpoint, OpenAPIParameter, OpenAPIParameterType } from '@model';
import { OpenAPIRequestBody, OpenAPIResponse, OpenAPIHeader } from '@model';


@Injectable({
	providedIn: 'root'
})
export class EndpointService {

	public parseFromOpenAPI(url: string, method: string, openAPIEndpoint: OpenAPIEndpoint): SpecEndpointData
	{
		const endpoint: SpecEndpointData = {
			method: method.toUpperCase(),
			url: url,
			summary: openAPIEndpoint.summary,
			pathParameters: [],
			queryStrings: [],
			responses: [],
			collapsed: true
		};

		if (!!openAPIEndpoint.description)
		{
			endpoint.description = openAPIEndpoint.description;
		}

		if (!!openAPIEndpoint.parameters)
		{
			this.addParametersFromOpenAPI(endpoint, openAPIEndpoint.parameters);
		}

		if (!!openAPIEndpoint.requestBody)
		{
			this.addRequestBodyFromOpenAPI(endpoint, openAPIEndpoint.requestBody);
		}

		const responseStatusCodes: string[] = Object.keys(openAPIEndpoint.responses);
		for (const statusCode of responseStatusCodes)
		{
			const openAPIResponse: OpenAPIResponse = openAPIEndpoint.responses[statusCode];
			this.addResponseFromOpenAPI(endpoint, statusCode, openAPIResponse);
		}

		return endpoint;
	}

	private addParametersFromOpenAPI(endpoint: SpecEndpointData, openAPIParameters: OpenAPIParameter[])
	{
		for (const openAPIParameter of openAPIParameters)
		{
			if (openAPIParameter.in === OpenAPIParameterType.Path)
			{
				const pathParameter: SpecEndpointPathParameter = {
					name: openAPIParameter.name,
					description: openAPIParameter.description
				}

				if (!!openAPIParameter.schema.type) {
					pathParameter.type = openAPIParameter.schema.type;
				}

				endpoint.pathParameters.push(pathParameter);
			}
			else if (openAPIParameter.in === OpenAPIParameterType.Query)
			{
				const queryString: SpecEndpointQueryString = {
					name: openAPIParameter.name,
					description: openAPIParameter.description,
					required: openAPIParameter.required
				};

				if (!!openAPIParameter.schema.type) {
					queryString.type = openAPIParameter.schema.type;
				}

				if (!!openAPIParameter.schema.default) {
					queryString.default = openAPIParameter.schema.default;
				}

				endpoint.queryStrings.push(queryString);
			}
		}
	}

	private addRequestBodyFromOpenAPI(endpoint: SpecEndpointData, openAPIRequestBody: OpenAPIRequestBody)
	{
		if (openAPIRequestBody.content)
		{
			const mediaTypes: string[] = Object.keys(openAPIRequestBody.content);
			if (mediaTypes.length > 0) {

				const mediaType = mediaTypes[0];
				const requestBody: SpecEndpointRequestBody = {
					description: openAPIRequestBody.description,
					mediaType: mediaType
				}

				const schema = openAPIRequestBody.content[mediaType].schema;
				const schemaReference = schema["$ref"];
				if (!!schemaReference) {
					const modelName = schemaReference.startsWith("#/components/schemas/") ? schemaReference.substr(21) : schemaReference;
					requestBody.modelName = modelName;
				}

				const example = openAPIRequestBody.content[mediaType].example;
				if (!!example) {
					requestBody.example = example;
				}
		
				endpoint.requestBody = requestBody;
			}
		}
	}

	private addResponseFromOpenAPI(endpoint: SpecEndpointData, statusCode: string, openAPIResponse: OpenAPIResponse)
	{
		const response: SpecEndpointResponse = {
			statusCode: +statusCode,
		};

		if (!!openAPIResponse.description) {
			response.description = openAPIResponse.description;
		}

		if (!!openAPIResponse.headers) {
			response.headers = [];
			const headerNames: string[] = Object.keys(openAPIResponse.headers);
			for (const headerName of headerNames) {
				const openAPIHeader: OpenAPIHeader = openAPIResponse.headers[headerName];
				const responseHeader: SpecEndpointResponseHeader = {
					name: headerName,
					description: openAPIHeader.description
				};

				if (openAPIHeader.schema.type) {
					responseHeader.type = openAPIHeader.schema.type;
				}

				response.headers.push(responseHeader);
			}
		}

		if (openAPIResponse.content)
		{
			const mediaTypes: string[] = Object.keys(openAPIResponse.content);
			if (mediaTypes.length > 0) {
				const mediaType: string = mediaTypes[0];
				response.mediaType = mediaType;
	
				const schema = openAPIResponse.content[mediaType].schema;
				const schemaReference = schema["$ref"];
				if (!!schemaReference)
				{
					const modelName: string = schemaReference.startsWith("#/components/schemas/") ? schemaReference.substr(21) : schemaReference;
					if (modelName) {
						response.modelName = modelName;
					}
				}
	
				const example = openAPIResponse.content[mediaType].example;
				if (!!example) {
					response.example = example;
				}
			}
		}

		endpoint.responses.push(response);
	}

}
