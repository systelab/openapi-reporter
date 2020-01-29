import { Component, Input } from '@angular/core';

import { SpecEndpointData } from '../../../model/spec-endpoint-data.model';

@Component({
	selector: 'app-spec-endpoint',
	templateUrl: 'app-spec-endpoint.component.html',
	styleUrls: ['app-spec-endpoint.component.scss']
})
export class SpecEndpointComponent {

	@Input() public endpoint: SpecEndpointData = null;

	public constructor() {}
}
