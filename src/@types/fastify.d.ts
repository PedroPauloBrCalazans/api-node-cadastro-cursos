import fastify from "fastify";

declare module "fastify" {
  export interface FastifyRequest {
    user?: {
      sub: string;
      role: "student" | "manager";
    };
  }
}

//estou extendendo interfaces já existentes de uma lib que é o (FastifyRequest)
