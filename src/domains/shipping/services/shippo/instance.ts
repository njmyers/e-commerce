import { Shippo } from './Shippo';
import config from '@inscripted/config';

export const shippo = new Shippo({
  baseUrl: config.get('shippo.baseUrl'),
  token: config.get('shippo.token'),
});
