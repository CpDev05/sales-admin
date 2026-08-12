export const UUID_PORT = Symbol('UUID_PORT');

export interface UuidPort {
  generate(): string;
}
