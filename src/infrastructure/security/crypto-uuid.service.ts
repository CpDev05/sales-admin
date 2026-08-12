import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { UuidPort } from '../../application/ports/uuid.port';

@Injectable()
export class CryptoUuidService implements UuidPort {
  generate(): string {
    return randomUUID();
  }
}
