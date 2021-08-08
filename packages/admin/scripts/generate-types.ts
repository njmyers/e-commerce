/* eslint-disable no-console */
import path from 'path';
import { generate } from '@graphql-codegen/cli';
import shell from 'shelljs';

import { API_URL } from '../test/constants';

const adminApiUrl = `${API_URL}/admin`;
const saveToFile = true;

const adminTypesFile = path.resolve(__dirname, '../src/types.ts');

const config = {
  avoidOptionals: {
    field: true,
    object: true,
    inputValue: false,
  },
};

async function generateGraphQLTypes() {
  const adminSchema = {
    [adminApiUrl]: {
      method: 'POST',
    },
  };

  await generate(
    {
      generates: {
        [adminTypesFile]: {
          schema: adminSchema,
          documents: 'src/**/*.graphql',
          plugins: ['typescript', 'typescript-operations'],
          config,
        },
      },
    },
    saveToFile
  );

  shell.exec(`yarn prettier ${adminTypesFile} --write`);
}

void (async function () {
  try {
    await generateGraphQLTypes();
  } catch (e) {
    console.error(e);
    shell.exit(1);
  }
})();
