import { Component, Input } from '@angular/core';

import { SpecModelData } from '@model';


@Component({
	selector: 'app-spec-model',
	templateUrl: 'spec-model.component.html',
	styleUrls: ['spec-model.component.scss']
})
export class SpecModelComponent {

	@Input() model: SpecModelData;

	public constructor() {}

	public toogleCollapsed()
	{
		this.model.collapsed = !this.model.collapsed;
	}
}
