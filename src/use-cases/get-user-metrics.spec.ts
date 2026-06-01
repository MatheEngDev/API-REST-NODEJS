import { expect, describe, it, beforeEach } from "vitest";
import { inMemorycheckInsRepository } from "../repositories/in-memory/in-memory-check-ins-repository";
import { GetUserMetricsUserCase } from "./get-user-metrics";

// const checkInsRepository = new inMemorycheckInsRepository();
// const CheckInUseCase = new CheckInUseCase(checkInsRepository);

let checkInsRepository: inMemorycheckInsRepository;
let sut: GetUserMetricsUserCase;

describe("get user metrics Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new inMemorycheckInsRepository();
    sut = new GetUserMetricsUserCase(checkInsRepository);
  });

  it("should be able to get check-ins count from metrics", async () => {
    await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: 1,
    });

    await checkInsRepository.create({
      gym_id: "gym-02",
      user_id: 1,
    });

    const { checkInsCount } = await sut.execute({
      userId: "1",
    });

    expect(checkInsCount).toEqual(2);
  });
});
