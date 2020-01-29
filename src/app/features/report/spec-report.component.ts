import { Component, Input } from '@angular/core';

import { SpecReportData } from '../../model/spec-report-data.model';

@Component({
	selector: 'app-spec-report',
	templateUrl: 'spec-report.component.html',
	styleUrls: ['spec-report.component.scss']
})
export class SpecReportComponent {

	@Input() public report: SpecReportData = null;
	@Input() public showSummary = true;
	@Input() public showSpecifications = true;

	public constructor() {}
}
