import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../../database/client.ts";
import { courses } from "../../database/schema.ts";
import { eq } from "drizzle-orm";
import z from "zod";

export const updateCourseRoute: FastifyPluginAsyncZod = async (server) => {
  server.put(
    "/courses/:id",
    {
      schema: {
        tags: ["courses"],
        summary: "Atualizar um curso",
        description:
          "Essa rota recebe um título e descrição e atualiza um curso no BD",
        body: z.object({
          title: z.string().min(5, "Título precisa ter 5 caracteres."),
          description: z
            .string()
            .min(5, "Descrição precisa ter 5 caracteres.")
            .nullable(),
        }),
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
      const { id } = request.params;
      const { title, description } = request.body;

      // Verifica se o curso existe
      const existingCourse = await db
        .select()
        .from(courses)
        .where(eq(courses.id, id))
        .limit(1);

      if (existingCourse.length === 0) {
        return reply.status(404).send({ message: "Curso não encontrado!" });
      }

      // Atualiza o curso
      await db
        .update(courses)
        .set({ title, description })
        .where(eq(courses.id, id));

      return reply.status(200).send({
        course: {
          id,
          title,
          description,
        },
      });
    }
  );
};
