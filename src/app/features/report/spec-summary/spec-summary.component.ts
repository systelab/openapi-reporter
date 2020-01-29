import { Component, Input } from '@angular/core';

import { SpecSummaryData } from '../../../model/spec-summary-data.model';


@Component({
	selector: 'app-spec-summary',
	templateUrl: 'spec-summary.component.html',
	styleUrls:   ['spec-summary.component.css']

})
export class SpecSummaryComponent {

	@Input() public summary: SpecSummaryData = null;

	public constructor() {}
}
