import { Injectable } from '@nestjs/common';

import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private readonly users: User[] = [];

  async create(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async update(user: User): Promise<User> {
    const index = this.users.findIndex(
      (storedUser) => storedUser.id === user.id,
    );

    if (index >= 0) {
      this.users[index] = user;
    }

    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.trim().toLowerCase();

    return this.users.find((user) => user.email === normalizedEmail) ?? null;
  }

  async findAll(): Promise<User[]> {
    return [...this.users];
  }
}
