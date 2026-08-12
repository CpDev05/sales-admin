import { User } from '../../domain/entities/user.entity';
import { AuthUserDto } from './auth-result.dto';

export function toAuthUserDto(user: User): AuthUserDto {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    status: user.status,
    roles: user.roleNames,
  };
}
