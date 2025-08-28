import { faker } from "@faker-js/faker";
import { db } from "../../database/client.ts";
import { courses } from "../../database/schema.ts";

export async function makeCourse(title?: string, description?: string) {
  const result = await db
    .insert(courses)
    .values({
      title: title ?? faker.lorem.words(2),
      description: description ?? faker.lorem.words(3),
    })
    .returning();

  return result[0];
}

//essa função vai criar um curso no BD
