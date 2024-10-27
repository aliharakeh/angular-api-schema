import { createRequest } from './api-types';

export class PostsRequests {
  baseUrl = '/posts';

  getPosts = () => createRequest<any>({
    url: '',
    method: 'GET'
  });

  getPostById = (id: number) => createRequest<any>({
    url: '/' + id,
    method: 'GET'
  });
}
