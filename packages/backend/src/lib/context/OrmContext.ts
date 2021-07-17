import { AsyncLocalStorage } from 'async_hooks';
import { v4 as uuid } from 'uuid';
import {
  MikroORM,
  IDatabaseDriver,
  Options,
  EntityManager,
  Connection,
} from '@mikro-orm/core';

interface Store<D extends IDatabaseDriver<C>, C extends Connection> {
  em: EntityManager<D>;
  id: string;
}

export interface TransactionCallback {
  (em: EntityManager): unknown | Promise<unknown>;
}

export class OrmContext<D extends IDatabaseDriver<C>, C extends Connection> {
  storage: AsyncLocalStorage<Store<D, C>>;
  orm!: Promise<MikroORM<D>>;

  constructor(options?: Options<D>) {
    this.storage = new AsyncLocalStorage();
    this.orm = new Promise((resolve, reject) => {
      MikroORM.init<D>(options)
        .then(instance => resolve(instance))
        .catch(error => reject(error));
    });
  }

  get store(): Store<D, C> {
    const store = this.storage.getStore();

    if (!store) {
      throw new Error(
        'Cannot find entity manager outside of a request context'
      );
    }

    return store;
  }

  get em(): Store<D, C>['em'] {
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
  async run<T extends TransactionCallback>(fn: T): Promise<ReturnType<T>> {
    const orm = await this.orm;
    const store = this.storage.getStore() ?? {
      em: orm.em.fork(true),
      id: uuid(),
    };

    // @ts-expect-error Fix me please
    return await this.storage.run(store, async () => {
      await store.em.begin();

      try {
        const result = await fn(store.em);
        await store.em.commit();

        return result;
      } catch (error) {
        await store.em.rollback();
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
    const store = this.storage.getStore() ?? {
      em: orm.em.fork(true),
      id: uuid(),
    };

    // @ts-expect-error Fix me please
    await this.storage.run(store, async () => {
      await store.em.begin();

      try {
        const result = await fn(store.em);
        await store.em.rollback();

        return result;
      } catch (error) {
        await store.em.rollback();
        throw error;
      }
    });
  }

  async close(): Promise<void> {
    const orm = await this.orm;
    await orm.close();
  }
}
