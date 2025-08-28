import { test, expect } from "vitest";
import request from "supertest";
import { server } from "../../app.ts";
import { makeCourse } from "../../tests/factories/make-course.ts";

test("Recuperar um curso pelo ID", async () => {
  await server.ready();

  const course = await makeCourse();

  const response = await request(server.server).get(`/courses/${course.id}`);

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    course: {
      id: expect.any(String),
      title: expect.any(String),
      description: expect.any(String),
    },
  });
});
