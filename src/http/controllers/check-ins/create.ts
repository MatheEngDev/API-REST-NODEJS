import z from "zod";
import type { FastifyReply, FastifyRequest } from "fastify";
import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.uuid(),
  });
  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) >= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) >= 180;
    }),
  });

  // SOLID - D - principio da inversão de dependência

  const { gymId } = createCheckInParamsSchema.parse(request.params);
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body);

  const CheckInUseCase = makeCheckInUseCase();

  await CheckInUseCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(201).send();
}
