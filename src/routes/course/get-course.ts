import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../../database/client.ts";
import { courses } from "../../database/schema.ts";
import { asc, ilike } from "drizzle-orm";
import z from "zod";

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/courses",
    {
      schema: {
        tags: ["courses"],
        summary: "Recuperar todos os cursos",
        querystring: z.object({
          search: z.string().optional(),
        }), // sempre vai ser um objeto, e sempre vai ser optional
        description: "Essa recupera todos os curso no BD",
        response: {
          200: z.object({
            courses: z.array(
              z.object({
                id: z.uuid(),
                title: z.string(),
                description: z.string().nullable(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const { search } = request.query;

      const result = await db
        .select()
        .from(courses)
        .orderBy(asc(courses.title))
        .where(search ? ilike(courses.title, `%${search}%`) : undefined);

      return reply.send({ courses: result });
    }
  );
};
