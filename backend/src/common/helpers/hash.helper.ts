import { compare, hash } from 'bcrypt';

const HASH_ROUNDS = 12;

export async function hashString(value: string): Promise<string> {
  return hash(value, HASH_ROUNDS);
}

export async function compareHashString(value: string, hashedValue: string): Promise<boolean> {
  return compare(value, hashedValue);
}
