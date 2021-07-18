import config from '../../mikro-orm.config';
import { Orm } from './Orm';

export const orm = new Orm(config);
