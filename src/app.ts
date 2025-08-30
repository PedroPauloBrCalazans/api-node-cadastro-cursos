import fastify from "fastify";
import crypto from "node:crypto"; //modulo interno do Node
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";

import { getCourseByIdRoute } from "./routes/course/get-course-by-id.ts";
import { deleteCourseRoute } from "./routes/course/delete-course.ts";
import { createCourseRoute } from "./routes/course/create-course.ts";
import { getCoursesRoute } from "./routes/course/get-course.ts";
import { updateCourseRoute } from "./routes/course/update-course.ts";
import { createLoginRoute } from "./routes/login/create-login.ts";

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
}).withTypeProvider<ZodTypeProvider>(); //conecta o sistema de tipos do Fastify com o Zod, para que as validações e os tipos definidos com Zod também funcionem no TypeScript.

if (process.env.NODE_ENV === "development") {
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
}

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

server.register(createCourseRoute);
server.register(getCourseByIdRoute);
server.register(getCoursesRoute);
server.register(deleteCourseRoute);
server.register(updateCourseRoute);

server.register(createLoginRoute);

export { server };
