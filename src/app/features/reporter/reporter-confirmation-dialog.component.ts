import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DialogRef, ModalComponent, SystelabModalContext } from 'systelab-components/widgets/modal';

import { SpecReportData } from '@model';
import { ItemsService } from '@jama/api/items.service';


export class ReporterConfirmationDialogParameters extends SystelabModalContext {
	public width = 900;
	public height = 600;
	public username: string;
	public password: string;
	public server: string;
	public report: SpecReportData;
	public projectId: number;
	public itemTypeId: number;
	public specSetId: number;
}

@Component({
	selector: 'app-reporter-confirmation-dialog',
	templateUrl: 'reporter-confirmation-dialog.component.html',
})
export class ReporterConfirmationDialogComponent implements ModalComponent<ReporterConfirmationDialogParameters>, OnInit {

	public parameters: ReporterConfirmationDialogParameters;

	public static getParameters(): ReporterConfirmationDialogParameters {
		return new ReporterConfirmationDialogParameters();
	}

	constructor(public dialog: DialogRef<ReporterConfirmationDialogParameters>,
				private itemsService: ItemsService,
				private toastr: ToastrService) {
		this.parameters = dialog.context;
	}

	public ngOnInit() {

		this.itemsService.configuration.username = this.parameters.username;
		this.itemsService.configuration.password = this.parameters.password;
		this.itemsService.configuration.basePath = this.parameters.server;
	}

	public isUploadEnabled() {
		return false;
	}

	public close(): void {
		if (document.body.classList.contains('modal-open')) {
			document.body.classList.remove('modal-open');
		}
		this.dialog.close(false);
	}

	public doUpload() {
		// TODO
	}

}
