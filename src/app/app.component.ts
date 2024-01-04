import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiClient as ApiCLientV1 } from './api-schema-v1/api-angular-client';
import { ApiClient as ApiCLientV2 } from './api-schema-v2/api-angular-client';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  public api_v1 = inject(ApiCLientV1);
  public api_v2 = inject(ApiCLientV2);

  ngOnInit() {
    console.log(this.api_v1.users.getUsers());
    console.log(this.api_v2.users.getUsers());
  }
}
