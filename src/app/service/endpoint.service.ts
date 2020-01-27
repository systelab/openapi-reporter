import { Injectable } from '@angular/core';

import { EndpointData } from '../model/endpoint-data.model';
import { OpenAPIEndpoint } from '../model/openapi.model';

@Injectable({
	providedIn: 'root'
})
export class EndpointService {

	public parseFromOpenAPI(url: string, method: string, openAPIEndpoint: OpenAPIEndpoint): EndpointData {

		const name: string = `{{method.toUpperCase()}} {{url}}`;
		return {
			name: name,
			description: ""
		};
	}
}
