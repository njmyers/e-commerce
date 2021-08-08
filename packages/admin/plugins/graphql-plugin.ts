import { merge } from 'webpack-merge';
import * as Core from '@njmyers/generator-core';

export default class GraphQLPlugin {
  name = 'GraphQLPlugin';

  onWebpackConfig({
    client,
    server,
    environment,
  }: Core.OnWebpackConfig): Core.OnWebpackConfig {
    const config = {
      module: {
        rules: [
          {
            test: /\.graphql?$/,
            loader: 'graphql-tag/loader',
          },
        ],
      },
    };

    return {
      environment,
      server: merge(server, config),
      client: merge(client, config),
    };
  }
}
