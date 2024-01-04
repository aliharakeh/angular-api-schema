import { createRequest } from '../api-types';

export class AdminRequests {
  baseUrl = '/api/users';

  getUsers = () => createRequest<any>({
    url: '/getAllAdmins',
    method: 'GET'
  });

  getUsersById = (id: string) => createRequest<any>({
    url: '/getAdminById',
    method: 'GET',
    params: { id }
  });

}
