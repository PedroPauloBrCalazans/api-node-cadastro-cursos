import { test, expect } from "vitest";
import request from "supertest";
import { server } from "../../app.ts";
import { faker } from "@faker-js/faker";
import { makeAuthenticatedUser } from "../../tests/factories/make-user.ts";
import { send } from "process";

test("Cria um curso com sucesso", async () => {
  await server.ready(); //espera o servidor está pronto, registrar todos os modulos

  const { token } = await makeAuthenticatedUser("manager");

  const title = faker.lorem.words(4);
  const description = faker.lorem.words(3);

  const response = await request(server.server)
    .post("/courses")
    .set("Content-Type", "application/json")
    .set("Authorization", token)
    .send({ title, description });

  expect(response.status).toEqual(201);
  expect(response.body).toEqual({
    courseId: expect.any(String),
  });
});
