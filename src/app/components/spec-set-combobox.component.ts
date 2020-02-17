import { ChangeDetectorRef, Component, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractApiComboBox } from 'systelab-components/widgets/combobox/abstract-api-combobox.component';
import { map } from 'rxjs/internal/operators';

import { AbstractitemsService } from '../jama/api/abstractitems.service';
import { SpecSetData } from '@model';


@Component({
	selector: 'spec-set-combobox',
	templateUrl: '../../../node_modules/systelab-components/html/abstract-combobox.component.html'
})

export class SpecSetComboBox extends AbstractApiComboBox<SpecSetData> {

	public totalItems = 0;

	public _project: number;

	set project(value: number) {
		this._project = value;

		this.refresh(null);
	}

	get project() {
		return this._project;
	}

	public _itemType: number;

	set itemType(value: number) {
		this._itemType = value;

		this.refresh(null);
	}

	get itemType() {
		return this._itemType;
	}

	constructor(public myRenderer: Renderer2, public chref: ChangeDetectorRef, public api: AbstractitemsService) {
		super(myRenderer, chref);
	}

	public getInstance() {
		return new SpecSetData();
	}

	public getDescriptionField(): string {
		return 'name';
	}

	public getCodeField(): string {
		return 'setKey';
	}

	public getIdField(): string {
		return 'id';
	}

	public getData(page: number, itemsPerPage: number): Observable<Array<SpecSetData>> {
		return this.api.getAbstractItems([this.project], [this.itemType])
			.pipe(map((value) => {
				this.totalItems = value.meta.pageInfo.totalResults;
				return value.data.map((item) => {
					const setData = new SpecSetData();
					setData.id = item.id;
					setData.setKey = item.globalId;
					setData.name = item.fields.name;
					return setData;
				})
			}));
	}

	public getTotalItems(): number {
		return this.totalItems;
	}
}
