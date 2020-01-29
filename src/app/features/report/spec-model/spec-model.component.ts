import { Component, Input } from '@angular/core';

import { SpecModelData } from '../../../model/spec-model-data.model';


@Component({
	selector: 'app-spec-model',
	templateUrl: 'spec-model.component.html'
})
export class SpecModelComponent {

	@Input() model: SpecModelData;

}
