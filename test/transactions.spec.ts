import { expect, it, beforeAll, afterAll, describe, beforeEach } from "vitest";
import { app } from "../src/app";
import request from "supertest";
import { execSync } from "node:child_process";

describe("Transactions routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  });

  it("should be able to creat a new transaction", async () => {
    await request(app.server)
      .post("/transactions")
      .send({
        title: "new transaction",
        amount: 5000,
        type: "credit",
      })
      .expect(201);
  });

  it("should be able to list all transactions", async () => {
    const creatTransactionsResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "new transaction",
        amount: 5000,
        type: "credit",
      });

    const cookies = creatTransactionsResponse.get("Set-Cookie");

    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies as string[])
      .expect(200);

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: "new transaction",
        amount: 5000,
      }),
    ]);
  });

  it("should be able to get a specifc transaction", async () => {
    const creatTransactionsResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "new transaction",
        amount: 5000,
        type: "credit",
      });

    const cookies = creatTransactionsResponse.get("Set-Cookie");

    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies as string[])
      .expect(200);

    const transactionId = listTransactionsResponse.body.transactions[0].id;

    const getTransactionsResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set("Cookie", cookies as string[])
      .expect(200);

    expect(getTransactionsResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: "new transaction",
        amount: 5000,
      })
    );
  });

  it("should be able to get the summary", async () => {
    const creatTransactionsResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "credit transaction",
        amount: 5000,
        type: "credit",
      });

    const cookies = creatTransactionsResponse.get("Set-Cookie");

    await request(app.server)
      .post("/transactions")
      .set("Cookie", cookies as string[])
      .send({
        title: "new debit transaction",
        amount: 2000,
        type: "debit",
      });

    const summaryResponse = await request(app.server)
      .get("/transactions/summary")
      .set("Cookie", cookies as string[])
      .expect(200);

    expect(summaryResponse.body.summary).toEqual({
      amount: 3000,
    })
    
  });
});
