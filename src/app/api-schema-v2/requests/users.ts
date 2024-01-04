import { createRequest } from '../api-types';

export class UserRequests {
  baseUrl = '/api/users';

  getUsers = () => createRequest<any>({
    url: '/getAllUsers',
    method: 'GET'
  });

  getUsersById = (id: string) => createRequest<any>({
    url: '/getUsersById',
    method: 'GET',
    params: { id }
  });

}
