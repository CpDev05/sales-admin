import { Entity } from './entity';
import { Permission } from './permission.entity';

export interface RoleProps {
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export class Role extends Entity<RoleProps> {
  constructor(id: string, props: RoleProps) {
    super(id, props);
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get permissions(): Permission[] {
    return [...this.props.permissions];
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
