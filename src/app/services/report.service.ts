import { Injectable } from '@angular/core';

import { SpecReportData } from '../model/spec-report-data.model';
import { OpenAPIDocument, OpenAPIPath, OpenAPIEndpoint } from '../model/openapi.model';
import { EndpointService } from './endpoint.service';
import { SpecEndpointComponent } from '../features/report/spec-endpoint/spec-endpoint.component';

@Injectable({
	providedIn: 'root'
})
export class ReportService {

	constructor(private endpointService: EndpointService) {
	}

	public parseFromOpenAPI(openAPIReport: OpenAPIDocument): SpecReportData {

		const specReport: SpecReportData = {
			title: openAPIReport.info.title,
			version: openAPIReport.info.version,
			summary: {
				description: openAPIReport.info.description,
			},
			endpoints: [],
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
				specReport.endpoints.push(specEndpoint);
			}
		}

		return specReport;
	}
}
