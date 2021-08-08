/* eslint-disable no-console */
import path from 'path';
import { generate } from '@graphql-codegen/cli';
import shell from 'shelljs';

import { API_URL, STORE_NAME } from '../test/constants';

const merchantApiUrl = `${API_URL}/${STORE_NAME}`;
const saveToFile = true;

const merchantTypesFile = path.resolve(__dirname, '../src/types.ts');

const config = {
  avoidOptionals: {
    field: true,
    object: true,
    inputValue: false,
  },
};

async function generateGraphQLTypes() {
  const merchantSchema = {
    [merchantApiUrl]: {
      method: 'POST',
    },
  };

  await generate(
    {
      generates: {
        [merchantTypesFile]: {
          schema: merchantSchema,
          documents: 'src/**/*.graphql',
          plugins: ['typescript', 'typescript-operations'],
          config,
        },
      },
    },
    saveToFile
  );

  shell.exec(`yarn prettier ${merchantTypesFile} --write`);
}

void (async function () {
  try {
    await generateGraphQLTypes();
  } catch (e) {
    console.error(e);
    shell.exit(1);
  }
})();
