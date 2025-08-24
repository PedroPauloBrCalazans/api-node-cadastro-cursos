import { test, expect } from "vitest";
import request from "supertest";
import { server } from "../../app.ts";

test("Cria um curso com sucesso", async () => {
  await server.ready();

  const response = await request(server.server)
    .post("/courses")
    .set("Content-Type", "application/json")
    .send({
      title: "Curso de Vue.js",
      description: "Curso completo de Vue.js",
    });

  console.log(response.body);
});
