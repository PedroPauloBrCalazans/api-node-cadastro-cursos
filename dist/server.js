"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const node_crypto_1 = __importDefault(require("node:crypto")); //modulo interno do Node
const server = (0, fastify_1.default)();
const courses = [
    { id: "1", title: "Curso de Node.js" },
    { id: "2", title: "Curso de React" },
    { id: "3", title: "Curso de React Native" },
];
server.get("/courses", () => {
    return { courses };
});
server.get("/courses/:id", (request, reply) => {
    const params = request.params;
    const courseId = params.id;
    const course = courses.find((course) => course.id === courseId);
    if (course) {
        return { course };
    }
    return reply.status(404).send();
});
server.post("/courses", (request, reply) => {
    const courseId = node_crypto_1.default.randomUUID();
    const body = request.body;
    const courseTitle = body.title;
    if (!courseTitle) {
        return reply.status(400).send({ message: "Título obrigatório." });
    }
    courses.push({ id: courseId, title: courseTitle });
    return reply.status(201).send({ courseId });
});
server.listen({ port: 3333 }).then(() => {
    console.log("HTTP server running!");
});
