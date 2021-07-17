import jwt from 'jsonwebtoken';
import { config } from '../../config';

export interface TokenPayload {
  email: string;
  id: number;
}

export function createToken(payload: TokenPayload): Promise<string> {
  const { secretKey, expiration } = config.get('token');
  // convert to seconds
  const expiresIn = expiration / 1000;

  return new Promise((resolve, reject) => {
    if (!isValidPayload(payload)) {
      return reject(new Error('Invalid authorization token payload'));
    }

    jwt.sign(payload, secretKey, { expiresIn }, (error, token) => {
      if (error) {
        return reject(error);
      }

      if (!token) {
        return reject(new Error('Invalid authorization token payload'));
      }

      return resolve(token);
    });
  });
}

export function parseToken(token: string): Promise<TokenPayload> {
  const { secretKey } = config.get('token');

  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, payload) => {
      if (error) {
        return reject(error);
      }

      if (!isValidPayload(payload)) {
        return reject(new Error('Invalid authorization token payload'));
      }

      return resolve(payload);
    });
  });
}

function isValidPayload(payload?: jwt.JwtPayload): payload is TokenPayload {
  const payloadKeys: (keyof TokenPayload)[] = ['email', 'id'];

  return Boolean(
    payload &&
      payloadKeys.every(key =>
        Object.prototype.hasOwnProperty.call(payload, key)
      )
  );
}
