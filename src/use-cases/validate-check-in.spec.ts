import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";
import { inMemorycheckInsRepository } from "../repositories/in-memory/in-memory-check-ins-repository";
import { ValidateCheckInUseCase } from "./validate-check-in";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

// const checkInsRepository = new inMemorycheckInsRepository();
// const CheckInUseCase = new CheckInUseCase(checkInsRepository);

let checkInsRepository: inMemorycheckInsRepository;
let sut: ValidateCheckInUseCase;

describe("Validate Check-in Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new inMemorycheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to validate the Check-in", async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: 1,
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.items[0]!.validated_at).toEqual(expect.any(Date));
  });

  it("should not be able to validate an inexistent Check-in", async () => {
    await expect(() =>
      sut.execute({
        checkInId: "inexistent-check-in-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to validate the Check-in after 20 minutes of its creation", async () => {
    vi.setSystemTime(new Date(2026, 7, 4, 20, 50));

    const createdCheckIn = await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: 1,
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;

    vi.advanceTimersByTime(twentyOneMinutesInMs);

   await  expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
      })).rejects.toBeInstanceOf(Error);
  });
});
