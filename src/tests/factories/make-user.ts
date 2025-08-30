import { faker } from "@faker-js/faker";
import { db } from "../../database/client.ts";
import { users } from "../../database/schema.ts";
import { hash } from "argon2";
import { randomUUID } from "node:crypto";

export async function makeUser() {
  const passawordBeforeHash = randomUUID();

  const result = await db
    .insert(users)
    .values({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: await hash(passawordBeforeHash),
    })
    .returning();

  return {
    user: result[0],
    passawordBeforeHash,
  };
}

//essa função vai criar um curso no BD
