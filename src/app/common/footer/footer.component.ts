import { Component } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
	selector: 'app-footer',
	templateUrl: 'footer.component.html',
	styleUrls: ['footer.component.css']

})
export class FooterComponent {

	public appVersion = environment.version;

}
