import { SetMetadata } from '@nestjs/common';
import { RoleDecorator } from '../utils/types';

export const ROLE_KEY = 'role_permission';
export const Role = (roles: RoleDecorator) => SetMetadata(ROLE_KEY, roles);
