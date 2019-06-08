import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-connected-users',
  templateUrl: './connected-users.component.html',
  styleUrls: ['./connected-users.component.sass'],
})
export class ConnectedUsersComponent {
  @Input() public users: string[] = [];
  @Input() public loggedUser: string;
  @Input() public userColor: string;
  @HostBinding('class.card') public card = true;
}
