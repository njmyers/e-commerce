/* eslint-disable no-console */
import { hydrate } from '@njmyers/generator-plugin-react/client';
import App from './app';

hydrate(App)
  .then(() => console.log('App loaded successfully'))
  .catch(() => console.log('Problem loading app'));
