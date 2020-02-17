import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgGridModule } from 'ag-grid-angular';
import { FileDropModule } from 'ngx-file-drop';
import { MarkdownModule } from 'ngx-markdown';
import { ToastrModule } from 'ngx-toastr';

import { ApiModule } from './jama/index';
import { SystelabComponentsModule } from 'systelab-components';
import { SystelabPreferencesModule } from 'systelab-preferences';
import { SystelabTranslateModule } from 'systelab-translate';

import { AppComponent } from './app.component';
import { NavbarComponent } from './common/navbar/navbar.component';
import { FooterComponent } from './common/footer/footer.component';
import { HelpComponent } from './features/help/help.component';
import { LoginDialog } from './features/login/login-dialog.component';

import { SpecReportComponent } from './features/report/spec-report.component';
import { SpecSummaryComponent } from './features/report/spec-summary/spec-summary.component';
import { SpecEndpointComponent } from './features/report/spec-endpoint/spec-endpoint.component';
import { SpecModelComponent } from './features/report/spec-model/spec-model.component';

import { ReporterDialogComponent } from './features/reporter/reporter-dialog.component';
import { ReporterConfirmationDialogComponent } from './features/reporter/reporter-confirmation-dialog.component';
import { ProjectComboBox } from './components/project-combobox.component';
import { ItemTypeComboBox } from './components/item-type-combobox.component';
import { SpecSetComboBox } from './components/spec-set-combobox.component';

import { GridHeaderContextMenuComponent } from 'systelab-components/widgets/grid/contextmenu/grid-header-context-menu.component';
import { DialogService, MessagePopupService } from 'systelab-components/widgets/modal';
import { GridContextMenuCellRendererComponent } from 'systelab-components/widgets/grid/contextmenu/grid-context-menu-cell-renderer.component';



@NgModule({
	imports: [
		FormsModule,
		ApiModule,
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		FileDropModule,
		SystelabPreferencesModule.forRoot(),
		SystelabComponentsModule.forRoot(),
		SystelabTranslateModule.forRoot(),
		AgGridModule.withComponents([
			GridContextMenuCellRendererComponent,
			GridHeaderContextMenuComponent
		]),
		ToastrModule.forRoot(),
		MarkdownModule.forRoot(),
		RouterModule.forRoot([],{
			anchorScrolling: 'enabled'
		})
	],
	declarations: [
		AppComponent,
		NavbarComponent,
		FooterComponent,
		HelpComponent,
		LoginDialog,
		SpecReportComponent,
		SpecSummaryComponent,
		SpecEndpointComponent,
		SpecModelComponent,
		ReporterDialogComponent,
		ReporterConfirmationDialogComponent,
		ProjectComboBox,
		ItemTypeComboBox,
		SpecSetComboBox
	],
	providers: [
		MessagePopupService,
		DialogService
	],
	entryComponents: [
		LoginDialog,
		ReporterDialogComponent,
		ReporterConfirmationDialogComponent
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
