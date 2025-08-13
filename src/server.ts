import fastify from "fastify";
import crypto from "node:crypto"; //modulo interno do Node

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

const courses = [
  { id: "1", title: "Curso de Node.js" },
  { id: "2", title: "Curso de React" },
  { id: "3", title: "Curso de React Native" },
];

server.get("/courses", () => {
  return { courses };
});

server.get("/courses/:id", (request, reply) => {
  type Params = {
    id: string;
  };

  const params = request.params as Params;
  const courseId = params.id;

  const course = courses.find((course) => course.id === courseId);

  if (course) {
    return { course };
  }

  return reply.status(404).send();
});

server.post("/courses", (request, reply) => {
  type Body = {
    title: string;
  };

  const courseId = crypto.randomUUID();

  const body = request.body as Body;
  const courseTitle = body.title;

  if (!courseTitle) {
    return reply.status(400).send({ message: "Título obrigatório." });
  }

  courses.push({ id: courseId, title: courseTitle });

  return reply.status(201).send({ courseId });
});

server.put("/courses/:id", (request, reply) => {
  type Params = {
    id: string;
  };

  type Body = {
    title: string;
  };

  const params = request.params as Params;
  const body = request.body as Body;

  const courseIndex = courses.findIndex((course) => course.id === params.id);

  if (courseIndex === -1) {
    return reply.status(404).send({ message: "Curso não encontrado." });
  }

  if (!body.title) {
    return reply.status(400).send({ message: "Título obrigatório." });
  }

  courses[courseIndex].title = body.title;

  return reply.status(200).send({ message: "Curso atualizado com sucesso." });
});

server.delete("/courses/:id", (request, reply) => {
  type Params = {
    id: string;
  };

  const params = request.params as Params;

  const courseIndex = courses.findIndex((course) => course.id === params.id);

  if (courseIndex === -1) {
    return reply.status(404).send({ message: "Curso não encontrado." });
  }

  courses.splice(courseIndex, 1);

  return reply.status(200).send({ message: "Curso removido com sucesso." });
});

server.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running!");
});
