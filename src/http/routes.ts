import { FastifyInstance } from "fastify";
import { authenticate } from "./controllers/authenticate";
import { register } from "./controllers/register";
import { profile } from "./controllers/profile";
import { VerifyJWT } from "./middlewares/verify-jwt";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", authenticate);

  /**authenticated */
  app.get("/me", { onRequest: [VerifyJWT] }, profile);
}
