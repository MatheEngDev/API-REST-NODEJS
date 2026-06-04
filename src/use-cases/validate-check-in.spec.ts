import { expect, describe, it, beforeEach, afterEach } from "vitest";
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

    // vi.useFakeTimers();
  });

  afterEach(() => {
    // vi.useRealTimers();
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
    expect( checkInsRepository.items[0]!.validated_at).toEqual(expect.any(Date));
  });
 

  it("should not be able to validate an inexistent Check-in", async () => {
    
   await expect(() =>
      sut.execute({
        checkInId: "inexistent-check-in-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
