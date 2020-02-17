import { Injectable } from '@angular/core';

import { SpecReportData, SpecEndpointData, SpecEndpointGroupData } from '@model';
import { OpenAPIDocument, OpenAPIPath, OpenAPIEndpoint, OpenAPISchema } from '@model';
import { SpecEndpointComponent } from '@features/report/spec-endpoint/spec-endpoint.component';
import { EndpointService } from './endpoint.service';
import { ModelService } from './model.service';
import { group } from '@angular/animations';


@Injectable({
	providedIn: 'root'
})
export class ReportService {

	constructor(private endpointService: EndpointService,
				private modelService: ModelService) {
	}

	public parseFromOpenAPI(openAPIReport: OpenAPIDocument): SpecReportData {

		const specReport: SpecReportData = {
			title: openAPIReport.info.title,
			version: openAPIReport.info.version,
			summary: {
				description: openAPIReport.info.description,
			},
			endpointGroups: [],
			models: []
		};

		if (openAPIReport.servers.length > 0) {
			specReport.summary.baseAddress = 'The base address of all the endpoints of this REST API is ' + openAPIReport.servers[0].url;
		}

		for (const url in openAPIReport.paths) {
			const openAPIPath: OpenAPIPath = openAPIReport.paths[url];
			for (const method in openAPIPath) {
				const openAPIEndpoint: OpenAPIEndpoint = openAPIPath[method];
				const specEndpoint = this.endpointService.parseFromOpenAPI(url, method, openAPIEndpoint);
				this.addEndpointToReport(specReport, specEndpoint);
			}
		}

		if (!!openAPIReport.components) {
			for (const modelName in openAPIReport.components.schemas) {
				const openAPISchema: OpenAPISchema = openAPIReport.components.schemas[modelName];
				const specModel = this.modelService.parseFromOpenAPI(modelName, openAPISchema);
				specReport.models.push(specModel);
			}
		}

		return specReport;
	}

	private addEndpointToReport(specReport: SpecReportData, specEndpoint: SpecEndpointData) {

		const groupName = specEndpoint.groupName;
		const nEndpointGroups = specReport.endpointGroups.length;
		for (let i = 0; i < nEndpointGroups; i++) {
			if (specReport.endpointGroups[i].name === groupName) {
				specReport.endpointGroups[i].endpoints.push(specEndpoint);
				return;
			}
		}

		const newEndpointGroup: SpecEndpointGroupData = {
			name: groupName,
			endpoints: [ specEndpoint ]
		};
		specReport.endpointGroups.push(newEndpointGroup);
	}
}
