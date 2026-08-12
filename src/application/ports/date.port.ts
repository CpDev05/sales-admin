export const DATE_PORT = Symbol('DATE_PORT');

export interface DatePort {
  now(): Date;
  addDays(date: Date, days: number): Date;
}
