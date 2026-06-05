import { PrismaGymsRepository } from "../../repositories/prisma/prisma-gyms-repository";
import { createGymUseCase } from "../create-gym";

export function makeCreateGymUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new createGymUseCase(gymsRepository);

  return useCase;
}
