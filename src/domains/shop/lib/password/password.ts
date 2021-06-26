import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

async function hash(clearText: string): Promise<string> {
  return await bcrypt.hash(clearText, SALT_ROUNDS);
}

async function check(clearText: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(clearText, hash);
}

export const password = {
  hash,
  check,
};
