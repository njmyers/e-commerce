import { GetParameterCommand } from '@aws-sdk/client-ssm';
import { ssmClient } from './ssm-client';
import { ApplicationError, ErrorCode, StatusCode } from '../../lib/error';

const TOP_LEVEL_KEY = 'e-commerce-backend';

export interface Secrets {
  [key: string]: string;
}

export enum ServiceProvider {
  Stripe = 'stripe',
  Shippo = 'shippo',
}

export interface StripeSecrets extends Secrets {
  stripeToken: string;
}

export interface ShippoSecrets extends Secrets {
  apiKey: string;
}

export interface SecretsByProvider {
  [ServiceProvider.Stripe]: StripeSecrets;
  [ServiceProvider.Shippo]: ShippoSecrets;
}

export interface GetSecretArgs<
  T extends ServiceProvider,
  K extends keyof SecretsByProvider[T]
> {
  shopName: string;
  serviceProvider: T;
  keyName: K;
}

export async function getSecret<
  T extends ServiceProvider,
  K extends keyof SecretsByProvider[T]
>(input: GetSecretArgs<T, K>): Promise<string> {
  const parameter = getParameterPath(input);
  const command = new GetParameterCommand({
    Name: parameter,
    WithDecryption: true,
  });

  try {
    const response = await ssmClient.send(command);
    const value = response.Parameter?.Value;

    if (!value) {
      throw new ApplicationError('Could not find required secure parameter', {
        code: ErrorCode.ERROR_NOT_FOUND,
        status: StatusCode.BadRequest,
        data: {
          parameter,
        },
      });
    }

    return value;
  } catch (error) {
    throw new ApplicationError('Could not find required secure parameter', {
      code: ErrorCode.ERROR_NOT_FOUND,
      status: StatusCode.BadRequest,
      data: {
        parameter,
      },
    });
  }
}

function getParameterPath<
  T extends ServiceProvider,
  K extends keyof SecretsByProvider[T]
>({ shopName, serviceProvider, keyName }: GetSecretArgs<T, K>): string {
  return `${TOP_LEVEL_KEY}/${shopName}/${serviceProvider}/${String(keyName)}`;
}
