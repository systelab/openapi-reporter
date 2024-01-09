import { Component, Input } from '@angular/core';
import { SpecEndpointGroupData } from '@model';


@Component({
  selector: 'app-spec-endpoint-group',
  templateUrl: './spec-endpoint-group.component.html',
  styleUrls: ['./spec-endpoint-group.component.scss'],
})
export class SpecEndpointGroupComponent {
  @Input() public endpointGroup: SpecEndpointGroupData;
  public expanded = false;

  public handleHeaderClick(): void {
    this.expanded = !this.expanded;
  }
}
