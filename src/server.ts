import fastify from "fastify";
import Cookie from "@fastify/cookie";
import { title } from "node:process";
import { env } from "./env";
import { transactionsRoutes } from "./routes/transactions";

const app = fastify();
app.register(Cookie)
app.register(transactionsRoutes,{
  prefix: "transactions",
})


app

  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log("HTPP Server Running!");
  });
