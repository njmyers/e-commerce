import convict from 'convict';

export const config = convict({
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
});
