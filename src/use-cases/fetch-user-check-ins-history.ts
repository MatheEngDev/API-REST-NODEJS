import { CheckIn } from "../generated/prisma";
import { CheckInsRepository } from "../repositories/check-ins-repository";

interface FetchUserCheckInsHistoryUserCaseRequest {
  userId: string;
  page: number;
}

interface FetchUserCheckInsHistoryUserCaseResponse {
  checkIns: CheckIn[];
}

export class FetchUserCheckInsHistoryUserCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInsHistoryUserCaseRequest): Promise<FetchUserCheckInsHistoryUserCaseResponse> {
    const checkIns = await this.checkInsRepository.findByManyByUserId(
      userId,
      page,
    );

    return {
      checkIns,
    };
  }
}
