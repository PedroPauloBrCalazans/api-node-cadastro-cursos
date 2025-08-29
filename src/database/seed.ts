//esse arquivo popula o nosso BD com dados Fictícios

import { db } from "./client.ts";
import { courses, enrollments, users } from "./schema.ts";

import { fakerPT_BR as faker } from "@faker-js/faker";
import { hash } from "argon2";

async function seed() {
  const passwordHash = await hash("123456");

  const usersInsert = await db
    .insert(users)
    .values([
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: passwordHash,
        role: "student",
      },
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: passwordHash,
        role: "student",
      },
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: passwordHash,
        role: "student",
      },
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
  ]);
}

seed();
