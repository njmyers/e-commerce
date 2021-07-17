import config from '../../mikro-orm.config';
import { OrmContext } from './OrmContext';

export const orm = new OrmContext(config);
