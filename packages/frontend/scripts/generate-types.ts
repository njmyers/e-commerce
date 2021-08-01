/* eslint-disable no-console */
import path from 'path';
import { generate } from '@graphql-codegen/cli';
import shell from 'shelljs';

import { API_URL, STORE_NAME } from '../test/constants';

const apiUrl = `${API_URL}/${STORE_NAME}`;
const typesFile = path.resolve(__dirname, '../src/merchant-types.ts');
const saveToFile = true;

async function generateGraphQLTypes() {
  const merchantSchema = {
    [apiUrl]: {
      method: 'POST',
    },
  };

  await generate(
    {
      generates: {
        [typesFile]: {
          schema: merchantSchema,
          documents: 'src/**/*.graphql',
          plugins: ['typescript', 'typescript-operations'],
          config: {
            avoidOptionals: {
              field: true,
              object: true,
              inputValue: false,
            },
          },
        },
      },
    },
    saveToFile
  );

  shell.exec(`yarn prettier ${typesFile} --write`);
}

void (async function () {
  try {
    await generateGraphQLTypes();
  } catch (e) {
    console.error(e);
    shell.exit(1);
  }
})();
