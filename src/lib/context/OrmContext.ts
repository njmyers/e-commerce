import { AsyncLocalStorage } from 'async_hooks';
import { v4 as uuid } from 'uuid';
import {
  MikroORM,
  IDatabaseDriver,
  Options,
  EntityManager,
} from '@mikro-orm/core';

interface Store<D extends IDatabaseDriver = IDatabaseDriver> {
  em: EntityManager<D>;
  id: string;
}

export interface TransactionCallback {
  (): Promise<unknown>;
}

export class OrmContext<D extends IDatabaseDriver = IDatabaseDriver> {
  storage: AsyncLocalStorage<Store<D>>;
  orm!: Promise<MikroORM<D>>;

  constructor(options?: Options<D>) {
    this.storage = new AsyncLocalStorage();
    this.orm = new Promise((resolve, reject) => {
      MikroORM.init<D>(options)
        .then(instance => resolve(instance))
        .catch(error => reject(error));
    });
  }

  get store(): Store<D> {
    const store = this.storage.getStore();

    if (!store) {
      throw new Error(
        'Cannot find entity manager outside of a request context'
      );
    }

    return store;
  }

  get em(): Store<D>['em'] {
    return this.store.em;
  }

  get id(): string {
    return this.store.id;
  }

  /**
   * Run a function within a request context
   *
   * @param fn - The function to run in a context
   */
  async run(fn: TransactionCallback): Promise<void> {
    const orm = await this.orm;
    const em = orm.em.fork(true);
    const id = uuid();

    // @ts-expect-error Fix me please
    await this.storage.run({ em, id }, async () => {
      await em.begin();

      try {
        const result = await fn();
        await em.commit();

        return result;
      } catch (error) {
        await em.rollback();
        throw error;
      }
    });
  }

  /**
   * Run a function within a request context and reverts any changes
   *
   * @param fn - The function to run in a context
   */
  async runAndRevert(fn: TransactionCallback): Promise<void> {
    const orm = await this.orm;
    const em = orm.em.fork(true);
    const id = uuid();

    // @ts-expect-error Fix me please
    await this.storage.run({ em, id }, async () => {
      await em.begin();

      try {
        const result = await fn();
        await em.rollback();

        return result;
      } catch (error) {
        await em.rollback();
        throw error;
      }
    });
  }

  async close(): Promise<void> {
    const orm = await this.orm;
    await orm.close();
  }
}
