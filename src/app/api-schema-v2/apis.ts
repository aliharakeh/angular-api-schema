import { AdminRequests } from './requests/admin';
import { UserRequests } from './requests/users';

export const DOMAIN = 'https://example.com';

export const APIs = {
  users: new UserRequests(),
  admin: new AdminRequests()
};
