import { Injectable } from '@angular/core';

import { SpecEndpointData } from '../model/spec-endpoint-data.model';
import { OpenAPIEndpoint } from '../model/openapi.model';

@Injectable({
	providedIn: 'root'
})
export class EndpointService {

	public parseFromOpenAPI(url: string, method: string, openAPIEndpoint: OpenAPIEndpoint): SpecEndpointData {

		const name = `${method.toUpperCase()} ${url}`;

		let description = openAPIEndpoint.summary;
		if (!!openAPIEndpoint.parameters) {
			description += '<br><br>';
			description += '<b>Parameters:</b><br>';
			description += 'Pending to define parameters';
		}

		return {
			name: name,
			description: description
		};
	}
}
