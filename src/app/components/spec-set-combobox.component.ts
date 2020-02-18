import { ChangeDetectorRef, Component, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractApiComboBox } from 'systelab-components/widgets/combobox/abstract-api-combobox.component';
import { map } from 'rxjs/internal/operators';
import 'rxjs/add/observable/of';

import { SpecSetData } from '@model';
import { AbstractitemsService } from '@jama/api/abstractitems.service';
import { ItemDataListWrapper } from '@jama/model/itemDataListWrapper';


@Component({
	selector: 'spec-set-combobox',
	templateUrl: '../../../node_modules/systelab-components/html/abstract-combobox.component.html'
})

export class SpecSetComboBox extends AbstractApiComboBox<SpecSetData> {

	public totalItems = 0;

	public _project: number;

	set project(value: number) {
		this._project = value;
		this.loadSpecSets();
	}

	get project() {
		return this._project;
	}

	public _itemType: number;

	set itemType(value: number) {
		this._itemType = value;
		this.loadSpecSets();
	}

	get itemType() {
		return this._itemType;
	}

	private specSets: SpecSetData[];

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

		if (!this.specSets) {
			return Observable.of([]);
		}

		const data = Array<SpecSetData>();
		const startIndex = this.getStartAt(page, itemsPerPage);
		const endIndex = ((startIndex + itemsPerPage) < this.specSets.length) ? (startIndex + itemsPerPage) : this.specSets.length;
		for (let i = startIndex; i < endIndex; i++) {
			data.push(this.specSets[i]);
		}

		return Observable.of(data);
	}

	public getTotalItems(): number {
		return this.totalItems;
	}

	public getStartAt(page: number, itemsPerPage: number) {
		return (page - 1) * itemsPerPage;
	}

	public async loadSpecSets() {

		this.specSets = undefined;
		if ((!this.project) || (!this.itemType)) {
			this.refresh(null);
			return;
		}

		const itemsData: ItemDataListWrapper =
			await this.api.getAbstractItems([this.project], [31], undefined, undefined, undefined,
											undefined, undefined, undefined, undefined, 0, 50).toPromise();
		const totalResults = itemsData.meta.pageInfo.totalResults;

		const specSets: SpecSetData[] = itemsData.data.filter((item) => item.childItemType === this.itemType).map((item) => {
			const setData = new SpecSetData();
			setData.id = item.id;
			setData.setKey = item.globalId;
			setData.name = item.fields.name;
			return setData;
		});

		for (let startIndex = 50; startIndex < totalResults; startIndex += 50) {
			const itemsPageData: ItemDataListWrapper =
				await this.api.getAbstractItems([this.project], [31], undefined, undefined, undefined,
												undefined, undefined, undefined, undefined, startIndex, 50).toPromise();
			itemsPageData.data.filter((item) => item.childItemType === this.itemType).forEach((item) => {
				const setData = new SpecSetData();
				setData.id = item.id;
				setData.setKey = item.globalId;
				setData.name = item.fields.name;
				specSets.push(setData);
			});
		}

		this.totalItems = specSets.length;
		this.specSets = specSets;

		this.refresh(null);
	}
}
