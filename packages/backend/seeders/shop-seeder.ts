/* eslint-disable no-console */
import { orm } from '../src/lib/context';
import { seeder } from '../test/seeder';

const TEST_PASSWORD = 'testpassword';
const ORDERS_TO_CREATE = 100;

void (async () => {
  try {
    await orm.run(async em => {
      await seeder({
        password: TEST_PASSWORD,
        ordersToCreate: ORDERS_TO_CREATE,
      });
      await em.flush();
    });
    console.log('Finished seeding the DB');
  } catch (error: unknown) {
    console.error('Error seeding DB', { error });
  } finally {
    console.log('Cleaning up');
    await orm.close();
  }
})();
