import { expect, describe, it, beforeEach } from "vitest";
import { inMemorycheckInsRepository } from "../repositories/in-memory/in-memory-check-ins-repository";
import { FetchUserCheckInsHistoryUserCase } from "./fetch-user-check-ins-history";

// const checkInsRepository = new inMemorycheckInsRepository();
// const CheckInUseCase = new CheckInUseCase(checkInsRepository);

let checkInsRepository: inMemorycheckInsRepository;
let sut: FetchUserCheckInsHistoryUserCase;

describe("Fetch Check-in history Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new inMemorycheckInsRepository();
    sut = new FetchUserCheckInsHistoryUserCase(checkInsRepository);
  });

  it("should be able to fetch Check-in history", async () => {
    await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: 1,
    });

    await checkInsRepository.create({
      gym_id: "gym-02",
      user_id:1,
    });

    const { checkIns } = await sut.execute({
      userId: "1",
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-01" }),
      expect.objectContaining({ gym_id: "gym-02" }),
    ]);
  });

  it("should be able to fetch paginated  Check-in history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: 1,
      });
    }
    const { checkIns } = await sut.execute({
      userId: "1",
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-21" }),
      expect.objectContaining({ gym_id: "gym-22" }),
    ]);
  });
});
