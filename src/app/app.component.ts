import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiClient as ApiCLientV1 } from './api-schema-v1/api-angular-client';
import { ApiClient as ApiCLientV2 } from './api-schema-v2/api-angular-client';
import { UsersApi } from './api=schema-v3/user-api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: ''
})
export class AppComponent implements OnInit {
  public api_v1 = inject(ApiCLientV1);
  public api_v2 = inject(ApiCLientV2);
  public api_v3 = inject(UsersApi);

  ngOnInit() {
    console.log(this.api_v1.users.getUsers); // error: getUsers is not a function
    console.log(this.api_v2.users.getUsers());
    console.log(this.api_v3.getUsers({ page: 1, limit: 10 }));
  }
}
