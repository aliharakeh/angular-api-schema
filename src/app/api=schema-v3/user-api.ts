import { InjectionToken } from '@angular/core';
import { GET, POST } from './utils';

export const UsersApi = new InjectionToken('USERS_API', {
  providedIn: 'root',
  factory: () => {
    return {
      getUsers: GET<number[], GetUsersParams>('/api/users'),
      getUserById: GET<any, GetUsersParams>('/api/users/:id'),
      createUser: POST<any, any, GetUsersParams>('/api/users'),
      deleteUser: POST<any, any, GetUsersParams>('/api/users/:id'),
      getAdmins: GET<any, GetUsersParams>('/api/admins'),
      getAdminById: GET<any, GetUsersParams>('/api/admins/:id'),
      createAdmin: POST<any, any, GetUsersParams>('/api/admins'),
      deleteAdmin: POST<any, any, GetUsersParams>('/api/admins/:id')
    };
  }
});

export type GetUsersParams = {
  page?: number,
  limit?: number,
  sort?: string,
  order?: string
};
