import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { AuthUserDto } from '../../dto/auth-result.dto';
import { toAuthUserDto } from '../../dto/auth-user.mapper';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../../domain/repositories/user.repository';

@Injectable()
export class GetAuthUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,
  ) {}

  async execute(userId: string): Promise<AuthUserDto> {
    const user = await this.users.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return toAuthUserDto(user);
  }
}
