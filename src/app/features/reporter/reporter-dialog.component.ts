import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { DialogRef, ModalComponent, SystelabModalContext } from 'systelab-components/widgets/modal';
import { ProjectsService, UsersService, ItemsService, AbstractitemsService } from '../../jama';
import { ProjectComboBox, ItemTypeComboBox, SpecSetComboBox } from '@components';
import { SpecReportData } from '@model';


export class ReporterDialogParameters extends SystelabModalContext {
	public width = 900;
	public height = 600;
	public username: string;
	public password: string;
	public server;
	public report: SpecReportData;
}

@Component({
	selector: 'app-reporter-dialog',
	templateUrl: 'reporter-dialog.component.html',
})
export class ReporterDialogComponent implements ModalComponent<ReporterDialogParameters>, OnInit {

	@ViewChild('projectComboBox') public projectComboBox: ProjectComboBox;
	@ViewChild('itemTypeComboBox') public itemTypeComboBox: ItemTypeComboBox;
	@ViewChild('specSetComboBox') public specSetComboBox: SpecSetComboBox;

	public parameters: ReporterDialogParameters;

	private _userId;

	private _selectedProjectId: number;
	public selectedProjectName: string;

	private _selectedItemTypeId: number;
	public selectedItemTypeName: string;

	private _selectedSpecSetId: number;
	public selectedSpecSetName: string;

	public static getParameters(): ReporterDialogParameters {
		return new ReporterDialogParameters();
	}

	constructor(public dialog: DialogRef<ReporterDialogParameters>,
				private usersService: UsersService,
				private projectsService: ProjectsService,
				private abstractItemsService: AbstractitemsService,
				private itemsService: ItemsService,
				private toastr: ToastrService) {
		this.parameters = dialog.context;
	}

	public ngOnInit() {
		this.usersService.configuration.username = this.parameters.username;
		this.usersService.configuration.password = this.parameters.password;
		this.usersService.configuration.basePath = this.parameters.server;

		this.projectsService.configuration.username = this.parameters.username;
		this.projectsService.configuration.password = this.parameters.password;
		this.projectsService.configuration.basePath = this.parameters.server;

		this.abstractItemsService.configuration.username = this.parameters.username;
		this.abstractItemsService.configuration.password = this.parameters.password;
		this.abstractItemsService.configuration.basePath = this.parameters.server;

		this.itemsService.configuration.username = this.parameters.username;
		this.itemsService.configuration.password = this.parameters.password;
		this.itemsService.configuration.basePath = this.parameters.server;

		if (this.parameters.username && this.parameters.password && this.parameters.server) {
			this.usersService.getCurrentUser()
				.subscribe((user) => {
					this._userId = user.data.id;
				}, (error) => {
					this.toastr.error('Couldn\'t get the username: ' + this.parameters.username);
				});
		}
	}

	public isValidForm() {
		if (this._userId) {
			return this.selectedProjectId && this.selectedItemTypeId && this.selectedSpecSetId;
		} else {
			return false;
		}
	}

	public get selectedProjectId(): number {
		return this._selectedProjectId;
	}

	public set selectedProjectId(value: number) {
		this._selectedProjectId = value;
		this.selectedItemTypeId = undefined;
		this.selectedItemTypeName = undefined;
		this.selectedSpecSetId = undefined;
		this.selectedSpecSetName = undefined;
		this.itemTypeComboBox.project = value;
	}

	public get selectedItemTypeId(): number {
		return this._selectedItemTypeId;
	}

	public set selectedItemTypeId(value: number) {
		this._selectedItemTypeId = value;
		this.selectedSpecSetId = undefined;
		this.selectedSpecSetName = undefined;
		this.specSetComboBox.project = this.selectedProjectId;
		this.specSetComboBox.itemType = value;
	}

	public get selectedSpecSetId(): number {
		return this._selectedSpecSetId;
	}

	public set selectedSpecSetId(value: number) {
		this._selectedSpecSetId = value;
	}

	public close(): void {
		if (document.body.classList.contains('modal-open')) {
			document.body.classList.remove('modal-open');
		}
		this.dialog.close(false);
	}

	public doRun() {
		// TODO
	}

}
