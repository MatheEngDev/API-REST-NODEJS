import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import tr from "zod/v4/locales/tr.js";
import { checkSessionIdExist } from "../middleware/check-session-id-exist";

export async function transactionsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request, reply) => {
    console.log(`[${request.method}] ${request.url}`);
  });

  app.get(
    "/",
    {
      preHandler: [checkSessionIdExist],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies;

      const transactions = await knex("transactions")
        .where("session_id", sessionId)
        .select();

      return { transactions };
    }
  );

  app.get(
    "/:id",
    {
      preHandler: [checkSessionIdExist],
    },
    async (request) => {
      const getTransactionParamsSchema = z.object({
        id: z.uuid(),
      });

      const { id } = getTransactionParamsSchema.parse(request.params);

      const { sessionId } = request.cookies;

      const transaction = await knex("transactions")
        .where({
          session_id: sessionId as string,
          id,
        })

        .first();

      return { transaction };
    }
  );

  app.get(
    "/summary",
    {
      preHandler: [checkSessionIdExist],
    },
    async (request) => {
      const { sessionId } = request.cookies;

      const summary = await knex("transactions")
        .where("session_id", sessionId)
        .sum("amount", { as: "amount" })
        .first();

      return { summary };
    }
  );

  app.post("/", async (request, reply) => {
    // {title, amount, type: credit ou debit}

    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body
    );

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();

      reply.cookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 7 days
      });
    }

    await knex("transactions").insert({
      id: randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      session_id: sessionId,
    });

    return reply.status(201).send();
  });
}
