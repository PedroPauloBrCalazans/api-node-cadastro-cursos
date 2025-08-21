//esse arquivo popula o nosso BD com dados Fictícios

import { db } from "./client.ts";
import { courses, enrollments, users } from "./schema.ts";

import { fakerPT_BR as faker } from "@faker-js/faker";

async function seed() {
  const usersInsert = await db
    .insert(users)
    .values([
      { name: faker.person.fullName(), email: faker.internet.email() },
      { name: faker.person.fullName(), email: faker.internet.email() },
      { name: faker.person.fullName(), email: faker.internet.email() },
      { name: faker.person.fullName(), email: faker.internet.email() },
    ])
    .returning();

  const coursesInsert = await db
    .insert(courses)
    .values([
      { title: faker.lorem.words(4), description: faker.lorem.words(7) },
      { title: faker.lorem.words(4), description: faker.lorem.words(7) },
    ])
    .returning();

  await db.insert(enrollments).values([
    { coursesId: coursesInsert[0].id, userId: usersInsert[0].id },
    { coursesId: coursesInsert[0].id, userId: usersInsert[1].id },
    { coursesId: coursesInsert[1].id, userId: usersInsert[2].id },
    { coursesId: coursesInsert[1].id, userId: usersInsert[3].id },
  ]);
}

seed();
