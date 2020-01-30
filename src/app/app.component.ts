import { ChangeDetectorRef, Component, QueryList, ViewChildren } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileSystemFileEntry, UploadEvent, UploadFile } from 'ngx-file-drop';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from 'systelab-components/widgets/modal';

import { SpecReportData } from './model/spec-report-data.model';
import { OpenAPIDocument } from './model/openapi.model';
import { ReporterDialogComponent, ReporterDialogParameters } from './features/reporter/reporter-dialog.component';
import { LoginDialog, LoginDialogParameters } from './features/login/login-dialog.component';
import { ReportService } from './service/report.service';


@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html'
})
export class AppComponent {

	public showUser = false;
	public showUpload = false;

	public username = '';
	public password = '';
	public server = 'https://snowjamaserver.systelab.net/rest/latest';
	public numberOfSteps = 1;

	public report: SpecReportData;
	public fileDropError: string;

	private _showSummary = true;
	get showSummary(): boolean {
		return this._showSummary;
	}

	set showSummary(show: boolean) {
		this._showSummary = show;
		this.update();
	}

	private _showSpecifications = true;
	get showSpecifications(): boolean {
		return this._showSpecifications;
	}

	set showSpecifications(show: boolean) {
		this._showSpecifications = show;
		this.update();
	}

	constructor(private http: HttpClient,
				private ref: ChangeDetectorRef,
				protected dialogService: DialogService,
				protected reportService: ReportService,
				private toastr: ToastrService) {
	}

	public fileDrop(event: UploadEvent) {

		this.fileDropError = undefined;

		const files: UploadFile[] = event.files;
		if (files.length !== 1) {
			this.fileDropError = 'Only a single OpenAPI specification file can be processed at a time.';
			return;
		}

		const fileEntry = files[0].fileEntry as FileSystemFileEntry;
		if (!fileEntry.name.endsWith('.json')) {
			this.fileDropError = 'Dropped file has not a JSON extension.';
			return;
		}

		fileEntry.file(info => {

			const reader = new FileReader();
			reader.onload = (e: any) => {

				let openAPIDocument: OpenAPIDocument;
				try {
					openAPIDocument = JSON.parse(e.target.result);
				} catch (e) {
					this.fileDropError = 'Dropped file is not a valid JSON';
					return;
				}

				this.report = undefined;
				try {
					this.report = this.reportService.parseFromOpenAPI(openAPIDocument);
				} catch (e) {
					this.fileDropError = 'Unexpected error while parsing JSON: ' + e;
					return;
				}
			};

			reader.readAsText(info);
		});
	}

	public update() {
		this.ref.detectChanges();
	}

	public doShowUser(show: boolean) {
		this.showUser = show;
		const parameters: LoginDialogParameters = LoginDialog.getParameters();
		parameters.username = this.username;
		parameters.password = this.password;
		parameters.server = this.server;
		this.dialogService.showDialog(LoginDialog, parameters)
			.subscribe(
				(result) => {
					if (result) {
						this.username = result.username;
						this.password = result.password;
						this.server = result.server;
					}
				});
	}

	public doShowUpload(show: boolean) {
		this.showUpload = show;
		const parameters: ReporterDialogParameters = ReporterDialogComponent.getParameters();
		parameters.username = this.username;
		parameters.password = this.password;
		parameters.server = this.server;
		parameters.report = this.report;

		if (!!this.report) {
			this.toastr.error('No specification provided.');
			return;
		}
		if (!parameters.username) {
			this.toastr.error('No username provided.');
			return;
		}
		if (!parameters.password) {
			this.toastr.error('No password provided.');
			return;
		}
		if (!parameters.server) {
			this.toastr.error('No server provided.');
			return;
		}

		this.dialogService.showDialog(ReporterDialogComponent, parameters)
			.subscribe(
				(result) => {

				});
	}
}
