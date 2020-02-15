import { Component, Input } from '@angular/core';

import { SpecModelData } from '@model';


@Component({
	selector: 'app-spec-model',
	templateUrl: 'spec-model.component.html',
	styleUrls: ['spec-model.component.scss']
})
export class SpecModelComponent {

	public bodyVisibile: boolean = false;

	@Input() model: SpecModelData;

	public constructor() {}

	public toogleBodyVisibility()
	{
		this.bodyVisibile = !this.bodyVisibile;
	}
}
