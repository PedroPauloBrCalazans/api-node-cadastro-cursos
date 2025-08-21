import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../../database/client.ts";
import { courses, enrollments } from "../../database/schema.ts";
import { and, asc, count, eq, ilike, SQL } from "drizzle-orm";
import z from "zod";
import id from "zod/v4/locales/id.js";

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/courses",
    {
      schema: {
        tags: ["courses"],
        summary: "Recuperar todos os cursos",
        querystring: z.object({
          search: z.string().optional(), // sempre vai ser um objeto, e sempre vai ser optional
          page: z.coerce.number().optional().default(1), //paginação
        }),
        description: "Essa recupera todos os curso no BD",
        response: {
          200: z.object({
            courses: z.array(
              z.object({
                id: z.uuid(),
                title: z.string(),
                description: z.string().nullable(),
                enrollments: z.number(),
              })
            ),
            total: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { search, page } = request.query;

      const conditions: SQL[] = [];

      if (search) {
        conditions.push(ilike(courses.title, `%${search}%`));
      }

      const [result, total] = await Promise.all([
        db
          .select({
            id: courses.id,
            title: courses.title,
            description: courses.description,
            enrollments: count(enrollments.id), // contar quantas matriculas eu tenho
          })
          .from(courses)
          .leftJoin(enrollments, eq(enrollments.coursesId, courses.id))
          .orderBy(asc(courses.title))
          .offset((page - 1) * 2)
          .limit(10)
          .where(and(...conditions))
          .groupBy(courses.id), // agrupar as matriculas por curso, cada curso vai ter tantas matriculas

        db.$count(courses, and(...conditions)), //qual a tabela que quero fz a contagem
      ]); // as 2 querys vão executar ao mesmo tempo no BD

      return reply.send({ courses: result, total });
    }
  );
};
