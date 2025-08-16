import fastify from "fastify";
import crypto from "node:crypto"; //modulo interno do Node
import { db } from "./database/client.ts";
import { courses } from "./database/schema.ts";
import { eq } from "drizzle-orm";
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { createCourseRoute } from "./routes/create-course.ts";
import { getCourseByIdRoute } from "./routes/get-course-by-id.ts";
import { getCoursesRoute } from "./routes/get-course.ts";

const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  }, //toda requisição que faço, vai dar um logger no terminal
}).withTypeProvider<ZodTypeProvider>();

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Desafio Node.js",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

server.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

server.register(createCourseRoute);
server.register(getCourseByIdRoute);
server.register(getCoursesRoute);

server.put("/courses/:id", async (request, reply) => {
  type Params = {
    id: string;
  };

  type Body = {
    title: string;
  };

  const params = request.params as Params;
  const body = request.body as Body;

  const coursesList = await db.select().from(courses);
  const courseIndex = coursesList.findIndex(
    (course) => course.id === params.id
  );

  if (courseIndex === -1) {
    return reply.status(404).send({ message: "Curso não encontrado." });
  }

  if (!body.title) {
    return reply.status(400).send({ message: "Título obrigatório." });
  }

  await db
    .update(courses)
    .set({ title: body.title })
    .where(eq(courses.id, params.id));

  return reply.status(200).send({ message: "Curso atualizado com sucesso." });
});

server.delete("/courses/:id", async (request, reply) => {
  type Params = {
    id: string;
  };

  const params = request.params as Params;

  const coursesList = await db.select().from(courses);
  const courseIndex = coursesList.findIndex(
    (course) => course.id === params.id
  );

  if (courseIndex === -1) {
    return reply.status(404).send({ message: "Curso não encontrado." });
  }

  await db.delete(courses).where(eq(courses.id, params.id));

  return reply.status(200).send({ message: "Curso removido com sucesso." });
});

server.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running!");
});
