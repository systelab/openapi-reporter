import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-navbar',
	templateUrl: 'navbar.component.html'
})
export class NavbarComponent {

	@Output() expand = new EventEmitter();
	@Output() collapse = new EventEmitter();
	@Output() user = new EventEmitter();
	@Output() upload = new EventEmitter();

	public doExpandClick() {
		this.expand.emit();
	}

	public doCollapseClick() {
		this.collapse.emit();
	}

	public doUserClick() {
		this.user.emit();
	}

	public doUploadClick() {
		this.upload.emit();
	}
}
