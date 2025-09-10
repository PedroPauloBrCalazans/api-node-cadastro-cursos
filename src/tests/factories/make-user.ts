import { faker } from "@faker-js/faker";
import { db } from "../../database/client.ts";
import { users } from "../../database/schema.ts";
import { hash } from "argon2";
import { randomUUID } from "node:crypto";
import { sign } from "jsonwebtoken";

export async function makeUser(role?: "manager" | "student") {
  const passawordBeforeHash = randomUUID();

  const result = await db
    .insert(users)
    .values({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: await hash(passawordBeforeHash),
      role,
    })
    .returning();

  return {
    user: result[0],
    passawordBeforeHash,
  };
} //essa função vai criar um usuario no BD

export async function makeAuthenticatedUser(role: "manager" | "student") {
  const { user } = await makeUser();

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET não existe");
  }

  const token = sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET);

  return { user, token };
}
