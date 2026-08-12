import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { HashPort } from '../../application/ports/hash.port';

@Injectable()
export class BcryptHashService implements HashPort {
  private readonly saltRounds = 10;

  hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.saltRounds);
  }

  compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
