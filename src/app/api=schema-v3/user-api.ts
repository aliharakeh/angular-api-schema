import { InjectionToken } from '@angular/core';
import { GET, POST } from './utils';

export const UsersApi = new InjectionToken('USERS_API', {
  providedIn: 'root',
  factory: () => {
    return {
      getUsers: GET<UsersRes, UsersParams>('/api/users'),
      getUserById: GET<UsersRes, UsersParams>('/api/users/:id'),
      createUser: POST<UsersRes, UserBody, UsersParams>('/api/users'),
      deleteUser: POST<UsersRes, UserBody, UsersParams>('/api/users/:id'),
      getAdmins: GET<UsersRes, UsersParams>('/api/admins'),
      getAdminById: GET<UsersRes, UsersParams>('/api/admins/:id'),
      createAdmin: POST<UsersRes, UserBody, UsersParams>('/api/admins'),
      deleteAdmin: POST<UsersRes, UserBody, UsersParams>('/api/admins/:id')
    };
  }
});

export type UsersRes = number[];

export type UserBody = {
  email: string,
  name: string,
};

export type UsersParams = {
  page?: number,
  limit?: number,
  sort?: string,
  order?: string
};
