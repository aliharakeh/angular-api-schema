import { InjectionToken } from '@angular/core';
import { DELETE, GET, POST, PUT } from './http-client-utils';

export const UsersApi = new InjectionToken('USERS_API', {
  providedIn: 'root',
  factory: () => {
    return {
      getUsers: GET<UsersParams>('/api/users')<User[]>,
      getUserById: GET('/api/users/:id')<User>,
      createUser: POST<UserBody>('/api/users')<User>,
      updateUser: PUT<UserBody>('/api/users/:id')<User>,
      deleteUser: DELETE('/api/users/:id')<User>
    };
  }
});

export type User = { name: string; email: string };

export type UsersParams = {
  page?: number,
  limit?: number,
  orderBy?: string,
  sort?: 'asc' | 'desc',
};

export type UserBody = {
  name: string,
  email: string,
};
