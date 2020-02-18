import { Injectable } from '@angular/core';

import { JamaRESTAPIEndpoint } from '@model';
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
			description += '<p>' + jamaEndpoint.data.description + '</p>';
		}

		if (jamaEndpoint.data.pathParameters.length > 0) {
		// <div class="section mb-3" *ngIf="">
		//     <div class="section-title">Path Parameters</div>
		//     <div class="section-content">
		//         <ul>
		//             <li *ngFor="let pathParameter of endpoint.pathParameters">
		//                 <i>&#123; {{pathParameter.name}} &#125;</i>
		//                 <ng-container *ngIf="!!pathParameter.type">&nbsp;&ndash;&nbsp;{{pathParameter.type}}</ng-container>
		//                 &ndash;&nbsp;{{pathParameter.description}}
		//             </li>
		//         </ul>
		//     </div>
		// </div>
		}

		return description;

		// <div class="section mb-3" *ngIf="endpoint.queryStrings.length > 0">
		//     <div class="section-title">Query Strings</div>
		//     <div class="section-content">
		//         <div class="container query-string-table mt-3 ml-4">
		//             <div class="row">
		//                 <div class="col-2 header-cell">Name</div>
		//                 <div class="col-3 header-cell">Description</div>
		//                 <div class="col-1 header-cell center">Type</div>
		//                 <div class="col-1 header-cell center">Required</div>
		//                 <div class="col-1 header-cell center">Default</div>
		//             </div>
		//             <div class="row" *ngFor="let queryString of endpoint.queryStrings">
		//                 <div class="col-2 cell">{{queryString.name}}</div>
		//                 <div class="col-3 cell">{{queryString.description}}</div>
		//                 <div class="col-1 cell center">{{queryString.type}}</div>
		//                 <div class="col-1 cell center">{{queryString.required}}</div>
		//                 <div class="col-1 cell center">{{queryString.default}}</div>
		//             </div>
		//         </div>
		//     </div>
		//     <br>
		// </div>

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
}
