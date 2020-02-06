import { Injectable } from '@angular/core';

import { SpecEndpointData, SpecEndpointPathParameter, SpecEndpointQueryString, SpecEndpointRequestBody } from '../model/spec-endpoint-data.model';
import { OpenAPIEndpoint, OpenAPIParameter, OpenAPIParameterType, OpenAPIRequestBody } from '../model/openapi.model';

@Injectable({
	providedIn: 'root'
})
export class EndpointService {

	public parseFromOpenAPI(url: string, method: string, openAPIEndpoint: OpenAPIEndpoint): SpecEndpointData {

		const endpoint: SpecEndpointData = {
			method: method.toUpperCase(),
			url: url,
			summary: openAPIEndpoint.summary,
			pathParameters: [],
			queryStrings: [],
			responses: []
		};

		if (!!openAPIEndpoint.parameters)
		{
			this.addParametersFromOpenAPI(endpoint, openAPIEndpoint.parameters);
		}

		if (!!openAPIEndpoint.requestBody)
		{
			this.addRequestBodyFromOpenAPI(endpoint, openAPIEndpoint.requestBody);
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
		const mediaTypes: string[] = Object.keys(openAPIRequestBody.content);
		if (mediaTypes.length > 0)
		{
			const mediaType = mediaTypes[0];
			const schema = openAPIRequestBody.content[mediaType].schema;
			const example = openAPIRequestBody.content[mediaType].example;
			const schemaReference = schema["$ref"];
			const modelName = schemaReference.startsWith("#/components/schemas/") ? schemaReference.substr(21) : schemaReference;

			const requestBody: SpecEndpointRequestBody = {
				description: openAPIRequestBody.description,
				mediaType: mediaType,
				modelName: modelName
			};

			if (!!example) {
				requestBody.example = example;
			}
	
			endpoint.requestBody = requestBody;
			console.log("Endpoint Request Body", endpoint.requestBody);
		}
	}
}
