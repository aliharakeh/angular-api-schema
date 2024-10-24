import { InjectionToken } from '@angular/core';
import { tap } from 'rxjs';
import { DELETE, GET, POST, PUT } from './http-client-utils';

export const UsersApi = new InjectionToken('USERS_API', {
  providedIn: 'root',
  factory: () => {
    const domain = 'https://example.com';
    const urlConfig = { baseUrl: `${domain}/api`, url: '/users' };
    const usersConfig = { mapTo: User, valueOnError: [] };
    const userConfig = { mapTo: User, valueOnError: null };
    return {
      getUsers: GET<UsersParams>({
        ...urlConfig,
        ...usersConfig,
        pipe: [
          tap((res: User[]) => res.forEach(u => u.isActive = true))
        ]
      })<User[]>,
      getUserById: GET<{ id: number }>({ ...urlConfig, ...userConfig })<User>,
      createUser: POST<UserBody>({ ...urlConfig, ...userConfig })<User>,
      updateUser: PUT<UserBody>({ ...urlConfig, ...userConfig })<User>,
      deleteUser: DELETE(urlConfig)
    };
  }
});

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

export class User {
  name: string;
  email: string;
  isActive: boolean;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
