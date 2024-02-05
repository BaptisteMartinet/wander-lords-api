import { ENUM } from '@sequelize-graphql/core';

export enum Role {
  Manager = 'Manager',
  Admin = 'Admin',
}

export const RoleEnum = ENUM({
  name: 'Role',
  values: Role,
  description: 'A test description la famille',
});
