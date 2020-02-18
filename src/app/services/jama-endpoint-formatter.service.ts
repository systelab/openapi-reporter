import { Injectable } from '@angular/core';

import { JamaRESTAPIEndpoint, SpecEndpointPathParameter, SpecEndpointQueryString } from '@model';
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

		return description;
	}

	private formatPathParameters(pathParameters: SpecEndpointPathParameter[]): string {

		let output = '<p><b>Path Parameters</b></p>\n';
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

	private formatRequestBody(): string {
		return ''; // TODO
	}

	// <div class="section mb-3" *ngIf="!!endpoint.requestBody">
	//     <div class="section-title">Request Body</div>
	//     <div class="section-content">
	//         <ul>
	//             <li>
	//                 <i>{{endpoint.requestBody.mediaType}}</i>
	//                 <span *ngIf="!!endpoint.requestBody.description">&nbsp;&ndash;&nbsp;<span [innerHTML]="endpoint.requestBody.description"></span></span>
	//                 <ul *ngIf="!!endpoint.requestBody.modelName">
	//                     <li>Format: <a [routerLink]="['/']" fragment="model-{{endpoint.requestBody.modelName}}">{{endpoint.requestBody.modelName}}</a></li>
	//                 </ul>
	//             </li>
	//         </ul>
	//     </div>
	// </div>

	// <div class="section mb-3" *ngIf="endpoint.responses.length > 0">
	//     <div class="section-title">Responses</div>
	//     <div class="section-content">
	//         <ul>
	//             <li *ngFor="let response of endpoint.responses">
	//                 {{response.statusCode}}
	//                 <span *ngIf="response.description">&ndash;&nbsp;<span [innerHTML]="response.description"></span></span>
	//                 <ul>
	//                     <li *ngIf="response.mediaType">
	//                         <i>{{response.mediaType}}</i><span *ngIf="response.modelName">&nbsp;&ndash;&nbsp;<a [routerLink]="['/']" fragment="model-{{response.modelName}}">{{response.modelName}}</a></span>
	//                     </li>
	//                     <ng-container *ngIf="response.headers">
	//                         <li *ngIf="response.headers">
	//                             <i>Headers:</i>
	//                             <ul>
	//                                 <li *ngFor="let header of response.headers"><i>{{header.name}}</i><span *ngIf="!!header.type">&nbsp;&ndash;&nbsp;{{header.type}}</span>&nbsp;&ndash;&nbsp;<span [innerHTML]="header.description"></span></li>
	//                             </ul>
	//                         </li>
	//                     </ng-container>
	//                 </ul>
	//                 <br>
	//             </li>
	//         </ul>
	//     </div>
	// </div>

}
