import { PrismaCheckInsRepository } from "../../repositories/prisma/prisma-check-ins-repository";
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";
import { GetUserMetricsUserCase } from "../get-user-metrics";

export function makeGetUserMetricsUseCase(){
    const checkInsRepository = new PrismaCheckInsRepository();
    const useCase = new GetUserMetricsUserCase(checkInsRepository);

    return useCase;
}