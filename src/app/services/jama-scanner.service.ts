import { Injectable } from '@angular/core';

import { JamaRESTAPISpec, SpecReportData } from '@model';


@Injectable({
	providedIn: 'root'
})
export class JAMAScannerService {

	public async scanProject(specSetId: number, specReport: SpecReportData): Promise<JamaRESTAPISpec> {

		// TODO
		return null;
	}
}
