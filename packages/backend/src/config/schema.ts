import convict from 'convict';
import fs from 'fs';
import path from 'path';

export const config = convict({
  env: {
    format: String,
    default: 'production',
    env: 'NODE_ENV',
  },
  app: {
    port: {
      format: Number,
      env: 'APP_PORT',
      default: 5050,
    },
    host: {
      format: String,
      env: 'APP_HOST',
      default: 'localhost',
    },
  },
  db: {
    type: {
      doc: 'The database engine in use',
      format: String,
      env: 'DATABASE_ENGINE',
      default: 'postgresql',
    },
    address: {
      format: String,
      env: 'DATABASE_ADDRESS',
      default: '',
    },
    port: {
      format: Number,
      env: 'DATABASE_PORT',
      default: 5432,
    },
    name: {
      format: String,
      env: 'DATABASE_NAME',
      default: '',
    },
    username: {
      format: String,
      env: 'DATABASE_USERNAME',
      default: '',
    },
    password: {
      format: String,
      env: 'DATABASE_PASSWORD',
      default: '',
    },
  },
  token: {
    secretKey: {
      format: String,
      description: 'Token secret key used for signing tokens',
      default: 'some-test-secret',
      env: 'TOKEN_SECRET_KEY',
    },
    expiration: {
      format: Number,
      description: 'Token expiration in milliseconds',
      default: 1000 * 60 * 60 * 4,
      env: 'TOKEN_EXPIRATION',
    },
  },
  apollo: {
    debug: {
      format: Boolean,
      description: 'Whether to enable apollo debug mode',
      default: false,
      env: 'APOLLO_DEBUG',
    },
  },
  providers: {
    scoped: {
      format: Boolean,
      description: 'Whether to enable scoped providers via the secrets manager',
      default: false,
      env: 'PROVIDERS_SCOPED',
    },
    stripe: {
      token: {
        format: String,
        description: 'The stripe token to use when not using scoped providers',
        default: '',
        env: 'PROVIDERS_STRIPE_TOKEN',
      },
    },
  },
});

const env = config.get('env');

[`${env}.json`, `${env}.local.json`].forEach(fileName => {
  const filePath = path.resolve(__dirname, 'environments', fileName);
  if (fs.existsSync(filePath)) {
    config.loadFile(filePath);
    config.validate({ allowed: 'strict' });
  }
});
