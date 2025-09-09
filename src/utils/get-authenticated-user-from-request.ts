import { FastifyRequest } from "fastify";

export function getAuthenticatedUserFromRequest(request: FastifyRequest) {
  const user = request.user;

  if (!user) {
    throw new Error("Autenticação Inválida");
  }

  return user;
}
