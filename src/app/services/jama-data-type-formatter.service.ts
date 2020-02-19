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
			description += '<br>';
		}

		description += '<p>It shall have the following members:</p>';
		description += '<br>';
		description += '<table border=\"1\" cellpadding=\"1\" cellspacing=\"1\" style=\"width:575px\">\n';
		description += '    <tbody>\n';
		description += '        <tr>\n';
		description += '            <td style=\"width:120px\"><b>Name</b></td>\n';
		description += '            <td style=\"width:60px\" style=\"text-align:center\"><b>Type</b></td>\n';
		description += '            <td style=\"width:395px\"><b>Description</b></td>\n';
		description += '        </tr>\n';

		for (const modelProperty of jamaDataType.data.properties) {
			description += '        <tr>\n';
			description += '            <td style=\"width:120px\">' + modelProperty.name + '</td>\n';

			description += '            <td style=\"width:60px\" style=\"text-align:center\">';
			if (modelProperty.typeBasic || !modelProperty.typeId) {
				description += modelProperty.typeName;
			} else {
				description += `<a href='perspective.req#/items/${modelProperty.typeId}'>` + modelProperty.typeName + '</a>';
			}

			if (modelProperty.typeArray) {
				description += '[]';
			}

			description += '</td>\n';

			description += '            <td style=\"width:395px\">' + modelProperty.description + '</td>\n';
			description += '        </tr>\n';
		}

		description += '    </tbody>\n';
		description += '</table>\n';
		description += '<br>\n';

		return description;
	}
}
