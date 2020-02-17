import { ChangeDetectorRef, Component, Input, Renderer2 } from '@angular/core';
import { ProjectsService } from '../jama/api/projects.service';
import { Observable } from 'rxjs';
import { AbstractApiComboBox } from 'systelab-components/widgets/combobox/abstract-api-combobox.component';
import { map } from 'rxjs/internal/operators';

import { ItemTypeData } from '@model';


@Component({
	selector: 'item-type-combobox',
	templateUrl: '../../../node_modules/systelab-components/html/abstract-combobox.component.html'
})

export class ItemTypeComboBox extends AbstractApiComboBox<ItemTypeData> {

	public totalItems = 0;

	public _project: number;

	set project(value: number) {
		this._project = value;

		this.refresh(null);
	}

	get project() {
		return this._project;
	}

	constructor(public myRenderer: Renderer2, public chref: ChangeDetectorRef, public api: ProjectsService) {
		super(myRenderer, chref);
	}

	public getInstance() {
		return new ItemTypeData();
	}

	public getDescriptionField(): string {
		return 'name';
	}

	public getCodeField(): string {
		return 'typeKey';
	}

	public getIdField(): string {
		return 'id';
	}

	public getData(page: number, itemsPerPage: number): Observable<Array<ItemTypeData>> {
		return this.api.getItemTypesInProject(this.project, this.getStartAt(page, itemsPerPage), itemsPerPage)
			.pipe(map((value) => {
				this.totalItems = value.data.filter((t) => t.category === undefined).length;
				return value.data.filter((t) => t.category === undefined).map((t) => {
					const typeData = new ItemTypeData();
					typeData.id = t.id;
					typeData.typeKey = t.typeKey;
					typeData.name = t.display;
					return typeData;
				})
			}));
	}

	public getTotalItems(): number {
		return this.totalItems;
	}

	public getStartAt(page: number, itemsPerPage: number) {
		return (page - 1) * itemsPerPage;
	}

}
