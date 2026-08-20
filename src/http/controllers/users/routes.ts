import { FastifyInstance } from "fastify";
import { authenticate } from ".//authenticate";
import { register } from ".//register";
import { profile } from ".//profile";
import { VerifyJWT } from "@/http/middlewares/verify-jwt";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", authenticate);

  /**authenticated */
  app.get("/me", { onRequest: [VerifyJWT] }, profile);
}
