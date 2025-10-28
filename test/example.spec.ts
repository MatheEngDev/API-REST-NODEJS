import { expect, test, beforeAll, afterAll } from "vitest";
import { app } from "../src/app";
import request from "supertest";

beforeAll( async () => {
   await app.ready();
});

afterAll( async () => {
  await app.close();
});

test("o usuário consegue criar uma  nova aplicação", async () => {
  await request(app.server)
    .post("/transactions")
    .send({
      title: "new transaction",
      amount: 5000,
      type: "credit",
    })
    .expect(201)
});
