import { Inject, Injectable } from '@nestjs/common';

import { UserDto } from '../../dto/admin.dto';
import { toUserDto } from '../../dto/admin.mapper';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../../domain/repositories/user.repository';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,
  ) {}

  async execute(): Promise<UserDto[]> {
    const users = await this.users.findAll();

    return users.map(toUserDto);
  }
}
