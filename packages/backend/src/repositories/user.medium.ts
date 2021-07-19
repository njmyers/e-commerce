import { userRepo } from './user';
import { orm } from '../lib/orm';
import { generate } from '../../test/data';
import { password } from '../lib/password';
import { Role } from '../lib';

describe('userRepo', () => {
  afterAll(async () => {
    await orm.close();
  });

  describe.each([Role.Customer, Role.Admin, Role.Merchant])(
    'when the user is of role "%s"',
    role => {
      describe('create', () => {
        test('should create a user', async () => {
          await orm.runAndRevert(async em => {
            const input = generate.user();
            const user = await userRepo.create(role, input);
            await em.flush();

            // @ts-expect-error this test will fail if it is undefined
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
          await orm.runAndRevert(async em => {
            const input = generate.user();
            const user = await userRepo.create(role, input);
            await em.flush();

            const found = await userRepo.findById({
              id: user.id,
              role,
            });

            expect(found).toMatchObject(user);
          });
        });
      });

      describe('findByEmail', () => {
        test('should find a user by email', async () => {
          await orm.runAndRevert(async em => {
            const input = generate.user();
            const user = await userRepo.create(role, input);
            await em.flush();

            const found = await userRepo.findByEmail({
              email: user.email,
              role,
            });

            expect(found).toMatchObject(user);
          });
        });
      });

      describe('update', () => {
        test('should update the user email', async () => {
          await orm.runAndRevert(async em => {
            const input = generate.user();
            const user = await userRepo.create(role, input);
            await em.flush();

            const updates = generate.user();
            const updated = await userRepo.update({
              id: user.id,
              role,
              input: {
                email: updates.email,
              },
            });

            expect(updated).toMatchObject({
              name: user.name,
              email: updates.email,
            });
          });
        });
      });
    }
  );
});
