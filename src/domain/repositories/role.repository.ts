import { Role } from '../entities/role.entity';

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');

export interface RoleRepository {
  create(role: Role): Promise<Role>;

  update(role: Role): Promise<Role>;

  findById(id: string): Promise<Role | null>;

  findByName(name: string): Promise<Role | null>;

  findAll(): Promise<Role[]>;
}
