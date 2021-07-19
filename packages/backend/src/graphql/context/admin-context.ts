import { FastifyRequest } from 'fastify';

import { orm } from '../../lib/orm';
import { userRepo } from '../../repositories';
import { Admin } from '../../models/admin';
import { HeaderKey, RawHeaders, headers } from '../../lib/headers';
import { parseToken } from '../../lib/token';
import { Role } from '../../lib/permissions';
import { logger } from '../../lib/logger';

export interface AdminGraphQLContext {
  user?: Admin | null;
}

export interface AdminRequest {
  Headers?: RawHeaders;
}

interface ContextArgs {
  request: FastifyRequest<AdminRequest>;
}

export const adminContext = async ({
  request,
}: ContextArgs): Promise<AdminGraphQLContext> => {
  try {
    const token = headers.parse(request.headers, HeaderKey.Authorization);
    const payload = await parseToken(token);
    const user = await orm.run(async () => {
      return await userRepo.findById({
        role: Role.Admin,
        id: payload.id,
      });
    });

    logger.debug('Creating admin request context', {
      user,
    });

    return {
      user,
    };
  } catch {
    logger.debug('Creating admin request context', {
      user: null,
    });

    return {
      user: null,
    };
  }
};