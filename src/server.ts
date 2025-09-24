import fastify from "fastify";
import { knex } from "./database";
import { title } from "node:process";
import { env } from "./env";

const app = fastify();

// GET, POST, PUT, PATCH, DELETE

app.get("/hello", async () => {
  const transactions = await knex("transactions")
  .where('amount', 1000)
  .select("*");

  return transactions;
});

app

  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log("HTPP Server Running!");
  });
