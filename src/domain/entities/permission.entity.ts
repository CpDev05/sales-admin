import { Entity } from './entity';

export interface PermissionProps {
  code: string;
  name: string;
  description: string;
  module: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Permission extends Entity<PermissionProps> {
  constructor(id: string, props: PermissionProps) {
    super(id, props);
  }

  get code(): string {
    return this.props.code;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get module(): string {
    return this.props.module;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
