import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../database/client.ts";
import { courses } from "../../database/schema.ts";
import { checkRequestJWT } from "../hooks/check-request-jwt.ts";
import { checkUserRole } from "../hooks/check-user-role.ts";

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/courses",
    {
      preHandler: [checkRequestJWT, checkUserRole], // tem que ser nessa sequência (1° JWT, 2°ROLE)
      schema: {
        tags: ["courses"],
        summary: "Cadastrar um novo curso",
        description: "Essa rota recebe um título e cria um curso no BD",
        body: z.object({
          title: z.string().min(5, "Título precisa ter 5 caracteres."),
          description: z
            .string()
            .min(5, "Descrição precisa ter 5 caracteres.")
            .nullable(),
        }),
        response: {
          201: z
            .object({ courseId: z.uuid() })
            .describe("Curso criado com sucesso!"),
        },
      },
    },
    async (request, reply) => {
      const courseTitle = request.body.title;
      const descriptionBody = request.body.description;

      const result = await db
        .insert(courses)
        .values({ title: courseTitle, description: descriptionBody })
        .returning();

      return reply.status(201).send({ courseId: result[0].id });
    }
  );
};
