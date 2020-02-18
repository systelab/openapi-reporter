import { Injectable } from '@angular/core';

import { SpecEndpointExample } from '@model';


@Injectable({
	providedIn: 'root'
})
export class JAMAEndpointExampleFormatterService {

	constructor() {
	}

	public formatDescription(example: SpecEndpointExample): string {

		const description = '<p>' + example.title + ':</p>' + '<pre>' + example.description + '</pre>';
		return description;
	}
}
