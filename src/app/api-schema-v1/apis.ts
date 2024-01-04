import { createRequest } from './api-types';

export const DOMAIN = 'https://example.com';

export const APIs = {
  users: {
    baseUrl: '/api/users',
    requests: {
      getUsers: () => createRequest<string>({
        url: '/getAllUsers',
        method: 'GET'
      })
    }
  },
  admin: {
    baseUrl: '/api/admin',
    requests: {
      getUsers: (params: any) => createRequest<boolean>({
        url: '/getAllAdmins',
        method: 'GET',
        params
      })
    }
  }
};
