import { Permission } from '../entities/permission.entity';

export interface PermissionRepository {
  create(permission: Permission): Promise<Permission>;

  update(permission: Permission): Promise<Permission>;

  findById(id: string): Promise<Permission | null>;

  findByCode(code: string): Promise<Permission | null>;

  findAll(): Promise<Permission[]>;
}
