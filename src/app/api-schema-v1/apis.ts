import { createRequest } from './api-types';

export const DOMAIN = 'https://jsonplaceholder.typicode.com';

export const APIs = {
  posts: {
    baseUrl: '/posts',
    requests: {
      getPosts: () => createRequest<string>({
        url: '',
        method: 'GET'
      }),
      getPostById: (id: number) => createRequest<string>({
        url: '/' + id,
        method: 'GET'
      })
    }
  }
};
