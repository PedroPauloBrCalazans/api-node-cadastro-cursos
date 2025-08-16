import fastify from "fastify";
import crypto from "node:crypto"; //modulo interno do Node
import { db } from "./database/client.ts";
import { courses } from "./database/schema.ts";
import { asc, eq } from "drizzle-orm";

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
});

server.get("/courses", async (request, reply) => {
  const result = await db.select().from(courses).orderBy(asc(courses.title));

  return reply.send({ courses: result });
});

server.get("/courses/:id", async (request, reply) => {
  type Params = {
    id: string;
  };

  const params = request.params as Params;
  const courseId = params.id;

  const result = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId));

  if (result.length > 0) {
    return { course: result[0] };
  }

  return reply.status(404).send();
});

server.post("/courses", async (request, reply) => {
  type Body = {
    title: string;
  };

  const courseId = crypto.randomUUID();

  const body = request.body as Body;
  const courseTitle = body.title;

  if (!courseTitle) {
    return reply.status(400).send({ message: "Título obrigatório." });
  }

  const result = await db
    .insert(courses)
    .values({ id: courseId, title: courseTitle })
    .returning();

  return reply.status(201).send({ courseId: result[0].id });
});

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
