export const HASH_PORT = Symbol('HASH_PORT');

export interface HashPort {
  hash(value: string): Promise<string>;
  compare(value: string, hash: string): Promise<boolean>;
}
