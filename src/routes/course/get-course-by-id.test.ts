import { test, expect } from "vitest";
import request from "supertest";
import { server } from "../../app.ts";
import { faker } from "@faker-js/faker";

test("Recuperar um curso pelo ID", async () => {
  await server.ready();

  const response = await request(server.server).get("/courses/:id");

  expect(response.status).toEqual(201);
  expect(response.body).toEqual({
    course: {
      id: expect.any(String),
      title: expect.any(String),
      description: expect.any(String),
    },
  });
});
