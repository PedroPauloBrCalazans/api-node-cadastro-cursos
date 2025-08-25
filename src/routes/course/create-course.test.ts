import { test, expect } from "vitest";
import request from "supertest";
import { server } from "../../app.ts";
import { faker } from "@faker-js/faker";

test("Cria um curso com sucesso", async () => {
  await server.ready(); //espera o servidor está pronto, registrar todos os modulos

  const title = faker.lorem.words(4);
  const description = faker.lorem.words(3);

  const response = await request(server.server)
    .post("/courses")
    .set("Content-Type", "application/json")
    .send({ title, description });

  console.log("Status:", response.status);
  console.log("Body:", response.body);

  expect(response.status).toEqual(201);
  expect(response.body).toEqual({
    courseId: expect.any(String),
  });
});
