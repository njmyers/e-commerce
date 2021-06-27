import { userRepo } from './user';
import { orm } from '../../../lib/context';
import { generate } from '../../../../test/data';
import { password } from '../lib/password';

describe('userRepo', () => {
  afterAll(async () => {
    await orm.close();
  });

  describe('create', () => {
    test('should create a user', async () => {
      await orm.runAndRevert(async () => {
        const input = generate.user();
        const user = await userRepo.create(input);

        // @ts-expect-error this test will fail
        const match = await password.check(input.password, user.password);

        expect(match).toBe(true);
        expect(user).toMatchObject({
          email: input.email,
          name: input.name,
        });
      });
    });
  });

  describe('findById', () => {
    test('should find a user by id', async () => {
      await orm.runAndRevert(async () => {
        const input = generate.user();
        const user = await userRepo.create(input);

        const found = await userRepo.findById(user.id);
        expect(found).toMatchObject(user);
      });
    });
  });

  describe('findByEmail', () => {
    test('should find a user by email', async () => {
      await orm.runAndRevert(async () => {
        const input = generate.user();
        const user = await userRepo.create(input);

        const found = await userRepo.findByEmail(user.email);
        expect(found).toMatchObject(user);
      });
    });
  });

  describe('update', () => {
    test('should update the user email', async () => {
      await orm.runAndRevert(async () => {
        const input = generate.user();
        const updates = generate.user();

        const user = await userRepo.create(input);
        const updated = await userRepo.update(user.id, {
          email: updates.email,
        });

        expect(updated).toMatchObject({
          name: user.name,
          email: updates.email,
        });
      });
    });
  });
});
