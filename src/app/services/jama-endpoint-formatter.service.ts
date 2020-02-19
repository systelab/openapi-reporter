import { Injectable } from '@angular/core';

import { JamaRESTAPIEndpoint, SpecEndpointPathParameter, SpecEndpointQueryString, SpecEndpointRequestBody, SpecEndpointResponse } from '@model';
import { SpecEndpointData } from '@model';


@Injectable({
	providedIn: 'root'
})
export class JAMAEndpointFormatterService {

	constructor() {
	}

	public formatDescription(jamaEndpoint: JamaRESTAPIEndpoint): string {

		let description = '';
		if (!!jamaEndpoint.data.description) {
			description += '<p>' + jamaEndpoint.data.description + '</p>\n';
			description += '<br>\n';
		}

		if (jamaEndpoint.data.pathParameters.length > 0) {
			description += this.formatPathParameters(jamaEndpoint.data.pathParameters);
		}

		if (jamaEndpoint.data.queryStrings.length > 0) {
			description += this.formatQueryStrings(jamaEndpoint.data.queryStrings);
		}

		if (!!jamaEndpoint.data.requestBody) {
			description += this.formatRequestBody(jamaEndpoint.data.requestBody);
		}

		if (jamaEndpoint.data.responses.length > 0) {

			description += '<p><b>Responses</b></p>\n';
			description += '<br>\n';
			description += '<ul>\n';
			for (const response of jamaEndpoint.data.responses) {
				description += this.formatResponse(response);
			}
			description += '</ul>\n';
			description += '<br>\n';
		}

		return description;
	}

	private formatPathParameters(pathParameters: SpecEndpointPathParameter[]): string {

		let output = '<p><b>Path Parameters</b></p>\n';
		output += '<br>\n';
		output += '<ul>\n';

		for (const pathParameter of pathParameters) {
			output += '<li>';
			output += `<i>&#123; ${pathParameter.name} &#125;</i>`;
			if (!!pathParameter.type) {
				output += '&nbsp;&ndash;&nbsp;' + pathParameter.type;
			}
			output += '&nbsp;&ndash;&nbsp;' + pathParameter.description;
			output += '</li>\n';
		}

		output += '</ul>\n';
		output += '<br>\n';

		return output;
	}

	private formatQueryStrings(queryStrings: SpecEndpointQueryString[]): string {

		let output = '<p><b>Query strings</b></p>\n';
		output += '<br>\n';
		output += '<table border=\"1\" cellpadding=\"1\" cellspacing=\"1\" style=\"width:575px\">\n';
		output += '    <tbody>\n';

		output += '        <tr>\n';
		output += '            <td style=\"width:120px\"><b>Name</b></td>\n';
		output += '            <td style=\"width:275px\"><b>Description</b></td>\n';
		output += '            <td style=\"width:60px\"><b>Type</b></td>\n';
		output += '            <td style=\"width:60px\"><b>Required</b></td>\n';
		output += '            <td style=\"width:60px\"><b>Default</b></td>\n';
		output += '        </tr>\n';

		for (const queryString of queryStrings) {
			output += '        <tr>\n';
			output += '            <td style=\"width:120px\">' + queryString.name + '</td>\n';
			output += '            <td style=\"width:275px\">' + queryString.description + '</td>\n';
			output += '            <td style=\"width:60px\">' + (!!queryString.type ? queryString.type : '') + '</td>\n';
			output += '            <td style=\"width:60px\">' + (queryString.required ? 'true' : 'false') + '</td>\n';
			output += '            <td style=\"width:60px\">' + (!!queryString.default ? queryString.default : '') + '</td>\n';
			output += '        </tr>\n';
		}

		output += '    </tbody>\n';
		output += '</table>\n';
		output += '<br>\n';

		return output;
	}

	private formatRequestBody(requestBody: SpecEndpointRequestBody): string {

		let output = '<p><b>Request Body</b></p>\n';
		output += '<br>\n';
		output += '<ul>\n';
		output += '<li>';
		output += `<i>${requestBody.mediaType}</i>`;
		if (!!requestBody.description) {
			output += '&nbsp;&ndash;&nbsp;' + requestBody.description;
		}
		output += '\n';

		if (!!requestBody.modelName) {
			output += '<ul>\n';
			output += '<li>Format: ';
			if (!!requestBody.modelId) {
				output += `<a href='perspective.req#/items/${requestBody.modelId}'>${requestBody.modelName}</a>`;
			} else {
				output += requestBody.modelName;
			}
			output += '</li>\n';
			output += '</ul>\n';
		}

		output += '</li>\n';
		output += '</ul>\n';
		output += '<br>\n';

		return output;
	}

	private formatResponse(response: SpecEndpointResponse): string {

		let output = '<li>\n';
		output += response.statusCode;

		if (!!response.description) {
			output += '&nbsp;&ndash;&nbsp;' + response.description;
		}

		output += '<ul>\n';

		if (!!response.mediaType) {
			output += '<li>';
			output += '<i>' + response.mediaType + '</i>';
			if (!!response.modelName) {
				output += '&nbsp;&ndash;&nbsp;';
				if (!!response.modelId) {
					output += `<a href='perspective.req#/items/${response.modelId}'>${response.modelName}</a>`;
				} else {
					output += response.modelName;
				}
			}
			output += '</li>\n';
		}

		if (!!response.headers && response.headers.length > 0) {
			output += '<li>\n';
			output += '<i>Headers:</i>\n';
			output += '<ul>\n';
			for (const responseHeader of response.headers) {
				output += '<li>';
				output += '<i>' + responseHeader.name + '</i>';

				if (!!responseHeader.type) {
					output += '&nbsp;&ndash;&nbsp;';
					output += responseHeader.type;
				}

				if (!!responseHeader.description) {
					output += '&nbsp;&ndash;&nbsp;';
					output += responseHeader.description;
				}

				output += '</li>\n';
			}
			output += '</ul>\n';
			output += '</li>\n';
		}

		output += '</ul>\n';
		output += '</li>\n';
		output += '<br>\n';

		return output;
	}
}
