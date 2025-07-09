import { InjectionToken } from '@angular/core';
import { map } from 'rxjs';
import { Post, PostData } from '../app.models';
import { injectHttpHelpers } from './http-client-utils';

export const PostsApi = new InjectionToken('POSTS_API', {
  providedIn: 'root',
  factory: () => {
    const { GET, POST } = injectHttpHelpers();

    const domain = 'https://jsonplaceholder.typicode.com';
    const urlConfig = { baseUrl: () => domain, url: () => '/posts' };

    return {
      getPosts: GET<PostData | void>({
        ...urlConfig,
        valueOnError: [],
        pipe: [map((data) => new Post(data))],
      })<Post[]>,
      getPostById: GET<{ id: number }>({
        ...urlConfig,
        url: (id) => '/posts/' + id,
        valueOnError: null,
        pathParams: ['id'],
      })<Post>,
      createPost: POST<PostData>({ ...urlConfig, valueOnError: null })<Post>,
    };
  },
});
