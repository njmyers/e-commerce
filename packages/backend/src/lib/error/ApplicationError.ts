import { StatusCode } from './StatusCode';
import { ErrorCode } from './ErrorCode';

export type ErrorData = Record<string, unknown>;

export interface ErrorOptions {
  code?: ErrorCode;
  status?: StatusCode;
  data?: ErrorData;
}

export interface ErrorResponse {
  message: string;
  code: ErrorCode;
  status: StatusCode;
  data?: Record<string, unknown>;
}

export class ApplicationError extends Error {
  status: StatusCode;
  code: ErrorCode;
  data?: ErrorData;

  constructor(message: string, { code, status, data }: ErrorOptions) {
    super(message);
    this.name = 'ApplicationError';

    this.status = status ?? StatusCode.InternalServerError;
    this.code = code ?? ErrorCode.ERROR_UNKNOWN;
    this.data = data;

    Object.setPrototypeOf(this, ApplicationError.prototype);
  }

  toJSON(): ErrorResponse {
    return {
      message: this.message,
      status: this.status,
      code: this.code,
      data: this.data,
    };
  }
}
