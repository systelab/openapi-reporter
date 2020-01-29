import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, range, throwError } from 'rxjs';
import { concatMap, map,  takeWhile } from 'rxjs/operators';
import { format } from 'date-fns';
import { ToastrService } from 'ngx-toastr';

import { DialogRef, ModalComponent, SystelabModalContext } from 'systelab-components/widgets/modal';
import { ProjectsService, UsersService, ItemsService, TestRunDataListWrapper } from '../../jama';
import { ProjectComboBox } from '../../components/project-combobox.component';
import { SpecReportData } from '../../model/spec-report-data.model';


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

	public parameters: ReporterDialogParameters;

	private _userId;

	private _selectedProjectId: number;
	public selectedProjectName: string;

	private _selectedItemTypeId: number;
	public selectedItemTypeName: string;

	private _selectedSpecSetId: number;
	public selectedSpecSetName: string;

	public commitMessage = '';

	public static getParameters(): ReporterDialogParameters {
		return new ReporterDialogParameters();
	}

	constructor(public dialog: DialogRef<ReporterDialogParameters>,
				private usersService: UsersService,
				private projectsService: ProjectsService,
				private toastr: ToastrService,
				private itemsService: ItemsService) {
		this.parameters = dialog.context;
	}

	public ngOnInit() {
		this.usersService.configuration.username = this.parameters.username;
		this.usersService.configuration.password = this.parameters.password;
		this.usersService.configuration.basePath = this.parameters.server;

		this.projectsService.configuration.username = this.parameters.username;
		this.projectsService.configuration.password = this.parameters.password;
		this.projectsService.configuration.basePath = this.parameters.server;

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
			return this.selectedProjectId && this.selectedItemTypeId && this.selectedSpecSetId && this.commitMessage !== '';
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
		// this.itemTypeComboBox.project = value;
	}

	public get selectedItemTypeId(): number {
		return this._selectedItemTypeId;
	}

	public set selectedItemTypeId(value: number) {
		this._selectedItemTypeId = value;
		this.selectedSpecSetId = undefined;
		// this.specSetComboBox.itemType = value;
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
