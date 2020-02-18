import { Injectable } from '@angular/core';

import { JamaRESTAPIDataType } from '@model';
import { SpecModelData, SpecModelProperty } from '@model';


@Injectable({
	providedIn: 'root'
})
export class JAMADataTypeFormatterService {

	constructor() {
	}

	public formatDescription(jamaDataType: JamaRESTAPIDataType): string {

		let description = '';
		if (!!jamaDataType.data.description) {
			description += '<p>' + jamaDataType.data.description + '</p>';
		}

		return description;
	}
}
