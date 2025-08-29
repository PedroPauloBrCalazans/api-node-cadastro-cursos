//Lucca58@hotmail.com / 123456

import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../database/client.ts";
import { users } from "../../database/schema.ts";
import { eq } from "drizzle-orm";
import { verify } from "argon2";

export const createLoginRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/sessions",
    {
      schema: {
        tags: ["auth"],
        summary: "Cadastrar um login",
        body: z.object({
          email: z.email(),
          password: z.string(),
        }),
        // response: {
        //   201: z
        //     .object({ courseId: z.uuid() })
        //     .describe("Curso criado com sucesso!"),
        // },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const result = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (result.length === 0) {
        return reply.status(400).send({ message: "Credenciais inválidas" });
      }

      const user = result[0];

      const doesPasswordsMatch = await verify(user.password, password);

      if (!doesPasswordsMatch) {
        return reply.status(400).send({ message: "Credenciais inválidas" });
      }

      return reply.status(200).send({ message: "ok" });
    }
  );
};
