import { expect, test } from "vitest";

test("o usuário consegue criar uma  nova aplicação", () => {
  const responseStatusCode = 201

  expect(responseStatusCode).toEqual(201)
})
