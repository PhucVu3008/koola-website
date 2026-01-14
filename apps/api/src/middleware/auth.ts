import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Authenticate an admin request using the configured Fastify JWT plugin.
 *
 * Expected behavior:
 * - If the token is valid, `request.user` will be populated by Fastify.
 * - If missing/invalid/expired token, returns 401 with the standard error envelope.
 *
 * Used by: Admin routes under `/v1/admin/**`.
 *
 * @returns An early reply (401) on failure; otherwise resolves and allows the
 * route handler to run.
 */
export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    return reply.status(401).send({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    });
  }
};

/**
 * Authorize an authenticated admin request based on allowed roles.
 *
 * Assumptions:
 * - `request.user.roles` is an array of role objects with at least a `name` field.
 * - Role names follow the project's authorization rules (e.g. `admin`, `editor`).
 *
 * @param allowedRoles - List of role names that are allowed to access the route.
 * @returns A Fastify preHandler which returns 403 if the user lacks permissions.
 */
export const authorize = (allowedRoles: string[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as any;

    if (!user || !user.roles) {
      return reply.status(403).send({
        error: {
          code: 'FORBIDDEN',
          message: 'Access denied',
        },
      });
    }

    const userRoles = user.roles.map((r: any) => r.name);
    const hasPermission = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasPermission) {
      return reply.status(403).send({
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions',
        },
      });
    }
  };
};
