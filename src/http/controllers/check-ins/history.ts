import z from "zod";
import type { FastifyReply, FastifyRequest } from "fastify";
import { makeFetchUserCheckInHistoryUseCase } from "@/use-cases/factories/make-fetch-user-check-in-history-use-case";

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const CheckInHistoryQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  // SOLID - D - principio da inversão de dependência

  const { page } = CheckInHistoryQuerySchema.parse(request.query);

  const fecthUserCheckInsHistoryUseCase = makeFetchUserCheckInHistoryUseCase();

  const { checkIns } = await fecthUserCheckInsHistoryUseCase.execute({
    userId: request.user.sub,
    page,
  });

  return reply.status(200).send({
    checkIns,
  });
}

// import type { FastifyReply, FastifyRequest } from "fastify";
// import { makeGetUserMetricsUseCase } from "@/use-cases/factories/make-get-user-metrics-use-case";

// export async function history(request: FastifyRequest, reply: FastifyReply) {

//   const GetUserMetricsUseCase = makeGetUserMetricsUseCase();

//   const { checkInsCount } = await GetUserMetricsUseCase.execute({
//     userId: request.user.sub,

//   });

//   return reply.status(200).send({
//     checkInsCount,
//   });
// }
