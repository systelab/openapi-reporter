import { Component, Input } from '@angular/core';

import { SpecEndpointData } from '../../../model/spec-endpoint-data.model';

@Component({
	selector: 'app-spec-endpoint',
	templateUrl: 'spec-endpoint.component.html',
	styleUrls: ['spec-endpoint.component.scss']
})
export class SpecEndpointComponent {

	public bodyVisibile: boolean = false;

	@Input() public endpoint: SpecEndpointData = null;

	public constructor() {}

	public toogleBodyVisibility()
	{
		this.bodyVisibile = !this.bodyVisibile;
	}
}
