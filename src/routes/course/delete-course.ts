import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../../database/client.ts";
import { courses } from "../../database/schema.ts";
import { eq } from "drizzle-orm";
import z from "zod";

export const deleteCourseRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    "/courses/:id",
    {
      schema: {
        tags: ["courses"],
        summary: "Deletar um curso",
        description: "Essa rota recebe um ID para deletar no BD",
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: z.object({
            course: z
              .object({
                id: z.uuid(),
              })
              .describe("Curso removido com sucesso."),
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
      const { id } = request.params;

      // Verifica se o curso existe
      const course = await db.select().from(courses).where(eq(courses.id, id));

      if (course.length === 0) {
        return reply.status(404).send({ message: "Curso não encontrado!" });
      }

      // Deleta o curso
      await db.delete(courses).where(eq(courses.id, id));

      return reply.status(200).send({ course: { id } });
    }
  );
};
