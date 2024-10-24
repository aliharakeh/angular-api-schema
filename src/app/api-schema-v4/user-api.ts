import { InjectionToken } from '@angular/core';
import { tap } from 'rxjs';
import { createHttpResource, DELETE, GET, POST, PUT } from './http-client-utils';

export const UsersApi = new InjectionToken('USERS_API', {
  providedIn: 'root',
  factory: () => {
    const domain = 'https://example.com';
    const urlConfig = { baseUrl: `${domain}/api`, url: '/users' };
    const usersConfig = { mapTo: User, valueOnError: [] };
    const userConfig = { mapTo: User, valueOnError: null };
    return {
      /*
       * TODO:
       * - the params types are not propagated to the outside
       * - one function is not enough for both body & params so we need the resurce to be internal to the http
       * function.
       * */
      getUsers: createHttpResource(({ request }) => GET<UsersParams, User[]>({
        params: request,
        options: {
          ...urlConfig,
          ...usersConfig,
          pipe: [
            tap((res: User[]) => res.forEach(u => u.isActive = true))
          ]
        }
      })),
      getUserById: createHttpResource(({ request }) => GET<{
        id: number
      }, User>({ params: request, options: { ...urlConfig, ...userConfig } })),
      createUser: createHttpResource(({ request }) => POST<UserBody, User>({
        params: request,
        options: { ...urlConfig, ...userConfig }
      })),
      updateUser: createHttpResource(({ request }) => PUT<UserBody, User>({
        params: request,
        options: { ...urlConfig, ...userConfig }
      })),
      deleteUser: createHttpResource(({ request }) => DELETE({
        params: request,
        options: urlConfig
      }))
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
