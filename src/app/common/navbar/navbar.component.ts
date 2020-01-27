import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-navbar',
	templateUrl: 'navbar.component.html'
})
export class NavbarComponent {

	@Input() toggleSpecifications;
	@Output() toggleSpecificationsChange = new EventEmitter<boolean>();

	@Input() toggleSummary;
	@Output() toggleSummaryChange = new EventEmitter<boolean>();

	@Output() user = new EventEmitter();
	@Output() upload = new EventEmitter();

	public doResultsClick() {
		this.toggleSpecifications = !this.toggleSpecifications;
		this.toggleSpecificationsChange.emit(this.toggleSpecifications);
	}

	public doSummaryClick() {
		this.toggleSummary = !this.toggleSummary;
		this.toggleSummaryChange.emit(this.toggleSummary);
	}

	public doUserClick() {
		this.user.emit();
	}

	public doUploadClick() {
		this.upload.emit();
	}
}
