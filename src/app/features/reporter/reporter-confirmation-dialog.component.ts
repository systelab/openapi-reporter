import { Component, OnInit } from '@angular/core';
import { DialogRef, ModalComponent, SystelabModalContext } from 'systelab-components/widgets/modal';
import { Subscription } from 'rxjs';

import { SpecReportData, JamaRESTAPISpec, ProgressData } from '@model';
import { ItemsService } from '@jama';
import { JAMAScannerService, JAMAUploaderService } from '@services';


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
	public progress: ProgressData = { running: false };
	public currentOperationMessage = '';
	public jamaSpec: JamaRESTAPISpec;

	public static getParameters(): ReporterConfirmationDialogParameters {
		return new ReporterConfirmationDialogParameters();
	}

	constructor(public dialog: DialogRef<ReporterConfirmationDialogParameters>,
				private itemsService: ItemsService,
				private jamaScannerService: JAMAScannerService,
				private jamaUploaderService: JAMAUploaderService) {
		this.parameters = dialog.context;
	}

	public ngOnInit() {

		this.itemsService.configuration.username = this.parameters.username;
		this.itemsService.configuration.password = this.parameters.password;
		this.itemsService.configuration.basePath = this.parameters.server;

		this.scanJAMASpecificationSet();
	}

	public isUploadEnabled() {
		return !!this.jamaSpec;
	}

	public close(): void {
		if (document.body.classList.contains('modal-open')) {
			document.body.classList.remove('modal-open');
		}
		this.dialog.close(false);
	}

	public async doUpload() {

		this.currentOperationMessage = 'Uploading JAMA specifications';
		this.progress = { running: true, current: 0, total: 100 };
		const uploadSubscription: Subscription = this.jamaUploaderService.uploadProgress$.subscribe(
			(uploadProgress) => {
				if (!!uploadProgress) {
					this.progress = uploadProgress;
				}
			}
		);

		await this.jamaUploaderService.uploadProject(this.jamaSpec);

		this.progress = { running: false };
		uploadSubscription.unsubscribe();

		if (document.body.classList.contains('modal-open')) {
			document.body.classList.remove('modal-open');
		}
		this.dialog.close(true);
	}

	private async scanJAMASpecificationSet() {

		this.currentOperationMessage = 'Scanning selected JAMA specification set';
		this.progress = { running: true, current: 0, total: 100 };
		const scanSubscription: Subscription = this.jamaScannerService.scanProgress$.subscribe(
			(scanProgress) => {
				if (!!scanProgress) {
					this.progress = scanProgress;
				}
			}
		);

		const specSetId = this.parameters.specSetId;
		const specItemTypeId = this.parameters.itemTypeId;
		const report = this.parameters.report;
		this.jamaSpec = await this.jamaScannerService.scanProject(specSetId, specItemTypeId, report, this.progress);

		this.progress = { running: false };
		scanSubscription.unsubscribe();
	}
}
