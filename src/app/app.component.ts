import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ApiClient as PostsApiV1 } from './api-schema-v1/api-angular-client';
import { ApiClient as PostsApiV2 } from './api-schema-v2/api-angular-client';
import { PostsApi as PostsApiV3 } from './api-schema-v3/posts-api';
import { Post } from './app.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    @for (log of logs(); track $index) {
    <div [innerHTML]="log"></div>

    @if (!$last) {
    <hr style="margin: 1.5rem 0;" />
    } }
  `,
})
export class AppComponent implements OnInit {
  public api_v1 = inject(PostsApiV1);
  public api_v2 = inject(PostsApiV2);
  public api_v3 = inject(PostsApiV3);

  readonly logs = signal<string[]>([]);

  // api_v3 resource
  readonly filter = signal(undefined);
  readonly getPostsResource = rxResource({
    params: () => this.filter(), // undefined == no initial load
    stream: ({ params }) => this.api_v3.getPosts(params),
  });

  constructor() {
    effect(() => {
      if (this.getPostsResource.hasValue()) {
        this.updateLogs(
          this.getPostsResource.value(),
          'API V3 Resource - getPosts'
        );
      }
    });
  }

  ngOnInit() {
    // api_v1
    this.api_v1.posts
      .getPosts()
      .subscribe((data) => this.updateLogs(data, 'API V1 - getPosts'));
    this.api_v1.posts
      .getPostById(1)
      .subscribe((data) => this.updateLogs(data, 'API V1 - getPostById'));

    // api_v2
    this.api_v2.posts
      .getPosts()
      .subscribe((data) => this.updateLogs(data, 'API V2 - getPosts'));
    this.api_v2.posts
      .getPostById(1)
      .subscribe((data) => this.updateLogs(data, 'API V2 - getPostById'));

    // api_v3
    this.api_v3
      .getPosts()
      .subscribe((data) => this.updateLogs(data, 'API V3 - getPosts'));
    this.api_v3
      .getPostById({ id: 1 })
      .subscribe((data) => this.updateLogs(data, 'API V3 - getPostById'));

    // api_v3 resource
    setTimeout(() => {
      this.filter.set({ userId: 1 }); // will refresh the request with the new params
    }, 1000);
  }

  updateLogs(data: any, source: string) {
    const dataLogs = !Array.isArray(data)
      ? `<li>${this.parsePost(data)}</li>`
      : data
          .slice(0, 15)
          .map((d) => `<li>${this.parsePost(d)}</li>`)
          .join('');
    this.logs.update((logs) => logs.concat(`<h2>[${source}]</h2>` + dataLogs));
  }

  parsePost(post: Post) {
    post.title = post.title.substring(0, 20) + '...';
    post.body = post.body.substring(0, 20) + '...';
    return JSON.stringify(post);
  }
}
