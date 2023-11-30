import { makeEnum } from '@lib/definitions';

export enum Role {
  Manager = 'Manager',
  Admin = 'Admin',
}

export const RoleEnum = makeEnum({
  name: 'Role',
  values: Role,
  description: 'A test description la famille',
});
