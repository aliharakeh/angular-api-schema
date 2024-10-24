import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiClient as ApiClientV1 } from './api-schema-v1/api-angular-client';
import { ApiClient as ApiClientV2 } from './api-schema-v2/api-angular-client';
import { UsersApi as UsersApiV3 } from './api-schema-v3/user-api';
import { UsersApi as UsersApiV4 } from './api-schema-v4/user-api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: ''
})
export class AppComponent implements OnInit {
  public api_v1 = inject(ApiClientV1);
  public api_v2 = inject(ApiClientV2);
  public api_v3 = inject(UsersApiV3);
  public api_v4 = inject(UsersApiV4);

  readonly someSignalDataV4 = signal(1);

  readonly getUsersV4 = this.api_v4.getUsers(this.someSignalDataV4);

  ngOnInit() {
    console.log(this.api_v1.users.getUsers); // error: getUsers is not a function
    console.log(this.api_v2.users.getUsers());
    console.log(this.api_v3.getUsers({ page: 1, limit: 10 }));
    console.log(this.getUsersV4.value());
  }
}
