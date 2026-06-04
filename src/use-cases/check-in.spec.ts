import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { inMemorycheckInsRepository } from "../repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { InmemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/index-browser";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

// const checkInsRepository = new inMemorycheckInsRepository();
// const CheckInUseCase = new CheckInUseCase(checkInsRepository);

let checkInsRepository: inMemorycheckInsRepository;
let sut: CheckInUseCase;
let gymsRepository: InmemoryGymsRepository;

describe("Check-in Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new inMemorycheckInsRepository();
    gymsRepository = new InmemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository as any);

  
      
    await gymsRepository.create({
      id: "gym-01",
      title: "JavaScript Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-23.6447814),
      longitude: new Decimal(-46.6424028),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to Check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "1",
      userLatitude: -23.6447814,
      userLongitude: -46.6424028,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to Check in twice on the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
    await sut.execute({
      gymId: "gym-01",
      userId: "1",
      userLongitude: -46.6424028,
      userLatitude: -23.6447814,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "1",
        userLongitude: -46.6424028,
        userLatitude: -23.6447814,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should  be able to Check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
    await sut.execute({
      gymId: "gym-01",
      userId: "1",
      userLongitude: -46.6424028,
      userLatitude: -23.6447814,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "1",
      userLongitude: -46.6424028,
      userLatitude: -23.6447814,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  //,

  it("should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-02",
      title: "JavaScript Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-21.2043007),
      longitude: new Decimal(-48.351042),
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-02",
        userId: "1",
        userLongitude: -46.6424028,
        userLatitude: -23.6447814,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
