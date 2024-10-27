import { InjectionToken } from '@angular/core';
import { Post, PostData } from '../app.models';
import { GET, POST } from './http-client-utils';

export const PostsApi = new InjectionToken('POSTS_API', {
  providedIn: 'root',
  factory: () => {
    const domain = 'https://jsonplaceholder.typicode.com';
    const urlConfig = { baseUrl: () => domain, url: () => '/posts' };
    return {
      getPosts: GET<PostData | void>({
        ...urlConfig,
        mapTo: Post,
        valueOnError: []
      })<Post[]>,
      getPostById: GET<{ id: number }>({
        ...urlConfig,
        url: id => '/posts/' + id,
        valueOnError: null,
        pathParams: ['id']
      })<Post>,
      createPost: POST<PostData>({ ...urlConfig, valueOnError: null })<Post>
    };
  }
});
