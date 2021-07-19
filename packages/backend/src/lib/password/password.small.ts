import { password } from './password';
import { generate } from '../../../test/data';

describe('password', () => {
  describe('hash', () => {
    test('should hash a password', async () => {
      const user = generate.user();
      const hashed = await password.hash(user.password);
      expect(user.password).not.toBe(hashed);
    });
  });

  describe('compare', () => {
    test('should accept a password when compared to a saved hashed password', async () => {
      const user = generate.user();
      const hashed = await password.hash(user.password);

      return await expect(password.check(user.password, hashed)).resolves.toBe(
        true
      );
    });

    test('should accept a password when compared to a different saved hashed password', async () => {
      const user1 = generate.user();
      const user2 = generate.user();

      const hashed1 = await password.hash(user1.password);

      return await expect(
        password.check(user2.password, hashed1)
      ).resolves.toBe(false);
    });
  });
});
