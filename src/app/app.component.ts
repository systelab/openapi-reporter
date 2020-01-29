import { ChangeDetectorRef, Component, QueryList, ViewChildren } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileSystemFileEntry, UploadEvent, UploadFile } from 'ngx-file-drop';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from 'systelab-components/widgets/modal';

import { SpecReportData } from './model/spec-report-data.model';
import { OpenAPIDocument } from './model/openapi.model';
import { ReporterDialogComponent, ReporterDialogParameters } from './features/reporter/reporter-dialog.component';
import { LoginDialog, LoginDialogParameters } from './features/login/login-dialog.component';


@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html'
})
export class AppComponent {

	public uploadingFiles: string[] = [];
	public report: SpecReportData = null;

	public showUser = false;
	public showReport = false;

	public username = '';
	public password = '';
	public server = 'https://snowjamaserver.systelab.net/rest/latest';
	public numberOfSteps = 1;

	private _showSummary = true;
	get showSummary(): boolean {
		return this._showSummary;
	}

	set showSummary(show: boolean) {
		this._showSummary = show;
		this.update();
	}

	private _showResults = true;
	get showResults(): boolean {
		return this._showResults;
	}

	set showResults(show: boolean) {
		this._showResults = show;
		this.update();
	}

	constructor(private http: HttpClient,
				private ref: ChangeDetectorRef,
				protected dialogService: DialogService,
				// protected testSuiteService: TestSuiteService,
				// protected testCaseService: TestCaseService,
				private toastr: ToastrService) {
	}

	public fileDrop(event: UploadEvent) {

		const files: UploadFile[] = event.files;

		for (const file of files) {
			const fileEntry = file.fileEntry as FileSystemFileEntry;
			fileEntry.file(info => {
				this.uploadingFiles.push(info.name);

				const reader = new FileReader();
				reader.onload = (e: any) => {
					if (info.name.endsWith('.json')) {
						const newReport: OpenAPIDocument = JSON.parse(e.target.result);
						this.report = null; // TODO: parsing report
					}
				};
				reader.onloadend = (e: any) => {
					for (let i = this.uploadingFiles.length - 1; i >= 0; i--) {
						if (this.uploadingFiles[i] === info.name) {
							this.uploadingFiles.splice(i, 1);
						}
					}

					this.update();
				};
				reader.readAsText(info);
			});
		}
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

	public doShowReport(show: boolean) {
		this.showReport = show;
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
