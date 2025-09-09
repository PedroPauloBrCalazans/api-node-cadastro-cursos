import type { FastifyRequest, FastifyReply } from "fastify";
import { verify } from "jsonwebtoken";
import { getAuthenticatedUserFromRequest } from "../../utils/get-authenticated-user-from-request.ts";

export async function checkUserRole(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = getAuthenticatedUserFromRequest(request);

  if (user.role !== "manager") {
    return reply.status(401).send();
  }
}
