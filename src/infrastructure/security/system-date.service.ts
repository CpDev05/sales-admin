import { Injectable } from '@nestjs/common';

import { DatePort } from '../../application/ports/date.port';

@Injectable()
export class SystemDateService implements DatePort {
  now(): Date {
    return new Date();
  }

  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);

    return result;
  }
}
