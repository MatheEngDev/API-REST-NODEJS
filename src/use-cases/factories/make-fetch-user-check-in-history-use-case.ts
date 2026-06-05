import { PrismaCheckInsRepository } from "../../repositories/prisma/prisma-check-ins-repository";
import { FetchUserCheckInsHistoryUserCase } from "../fetch-user-check-ins-history";

export function makeFetchUserCheckInHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const useCase = new FetchUserCheckInsHistoryUserCase(checkInsRepository);

  return useCase;
}
