import dayjs from "dayjs";
import { CheckIn } from "../generated/prisma";
import { CheckInsRepository } from "../repositories/check-ins-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { LateCheckInValidatonError } from "./errors/late-check-in-validation-error";

interface ValidateCheckInCaseRequest {
  checkInId: string;
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const distanceInMinutesFromCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      "minutes",
    );

    if (distanceInMinutesFromCreation > 20) {
      throw new LateCheckInValidatonError();
    }

    checkIn.validated_at = new Date();

    await this.checkInsRepository.save(checkIn);

    return {
      checkIn,
    };
  }
}
