import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// export const Roles = Reflector.createDecorator<string[]>();

export const ROLES = 'roles';
export const Roles = (roles: string[]) => SetMetadata(ROLES, roles);
