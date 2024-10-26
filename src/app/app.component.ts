import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ApiClient as PostsApiV1 } from './api-schema-v1/api-angular-client';
import { ApiClient as PostsApiV2 } from './api-schema-v2/api-angular-client';
import { PostsApi as PostsApiV3 } from './api-schema-v3/posts-api';
import { PostsApi as PostsApiV4 } from './api-schema-v4/posts-api';
import { Post } from './app.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    @for (log of logs(); track $index) {
      <div [innerHTML]="log"></div>

      @if (!$last) {
        <hr style="margin: 1.5rem 0;">
      }
    }
  `
})
export class AppComponent implements OnInit {
  public api_v1 = inject(PostsApiV1);
  public api_v2 = inject(PostsApiV2);
  public api_v3 = inject(PostsApiV3);
  public api_v4 = inject(PostsApiV4);

  readonly logs = signal<string[]>([]);

  // api_v4
  readonly filter = signal(null);
  readonly getPostsV4 = this.api_v4.getPosts(this.filter); // called on init

  constructor() {
    effect(() => {
      this.updateLogs(this.getPostsV4.value(), 'API V4');
    });
  }

  ngOnInit() {
    // api_v1 - error: getUsers is not a function
    // this.api_v1.posts.getPosts().subscribe(data => this.updateLogs(data, 'API V`'));

    // api_v2 - error: doesn't work
    // this.api_v2.posts.getPosts().subscribe(data => this.updateLogs(data, 'API V2'));

    // api_v3
    this.api_v3.getPosts({}).subscribe(data => this.updateLogs(data, 'API V3'));

    // api_v4
    setTimeout(() => {
      this.filter.set({ userId: 1 }); // will refresh the request with the new params
    }, 1000);
  }

  updateLogs(data: any, source: string) {
    const dataLogs = !Array.isArray(data) ?
                     `<li>${this.parsePost(data)}</li>` :
                     data.slice(0, 15).map(d => `<li>${this.parsePost(d)}</li>`).join('');
    this.logs.update(logs => logs.concat(`<h2>[${source}]</h2>` + dataLogs));
  }

  parsePost(post: Post) {
    post.title = post.title.substring(0, 20) + '...';
    post.body = post.body.substring(0, 20) + '...';
    return JSON.stringify(post);
  }
}
