import { Injectable } from '@angular/core';

import { JamaRESTAPISpec, SpecReportData } from '@model';


@Injectable({
	providedIn: 'root'
})
export class JAMAScannerService {

	public scanProject(specSetId: number, specReport: SpecReportData): JamaRESTAPISpec {

		// TODO
		return null;
	}
}
