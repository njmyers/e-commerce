import config from '../../mikro-orm.config';
import { OrmContext } from './OrmContext';

export const context = new OrmContext(config);
