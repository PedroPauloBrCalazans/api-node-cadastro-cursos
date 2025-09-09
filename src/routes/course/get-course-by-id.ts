import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../database/client";
import { courses } from "../../database/schema";
import { eq } from "drizzle-orm";
import { checkRequestJWT } from "../hooks/check-request-jwt.ts";
import { getAuthenticatedUserFromRequest } from "../../utils/get-authenticated-user-from-request.ts";

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/courses/:id",
    {
      preHandler: [checkRequestJWT],
      schema: {
        tags: ["courses"],
        summary: "Recuperar um curso pelo ID",
        description: "Essa rota recebe um id para recuperar um curso no BD",
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: z.object({
            course: z.object({
              id: z.uuid(),
              title: z.string(),
              description: z.string().nullable(),
            }),
          }),
          404: z
            .object({
              message: z.string(),
            })
            .describe("Curso não encontrado!"),
        },
      },
    },
    async (request, reply) => {
      const user = getAuthenticatedUserFromRequest(request); //pegando o ID de quem está autenticado

      const courseId = request.params.id;

      const result = await db
        .select()
        .from(courses)
        .where(eq(courses.id, courseId));

      if (result.length > 0) {
        return { course: result[0] };
      }

      return reply.status(404).send({ message: "Curso não encontrado!" });
    }
  );
};
