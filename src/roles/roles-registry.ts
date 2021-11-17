import { harvesterRole } from './harvester.role';
import { upgraderRole } from './upgrader.role';
import { builderRole } from './builder.role';

export interface Role {
  name: string;
  body: BodyPartConstant[];
  icon: string;
}

export const rolesRegistry = {
  harvester: harvesterRole,
  upgrader: upgraderRole,
  build: builderRole,
} as const;

export type AvailableRoles = typeof rolesRegistry;

export type RoleName = keyof AvailableRoles;
