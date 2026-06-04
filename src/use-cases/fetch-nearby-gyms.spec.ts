import { expect, describe, it, beforeEach } from "vitest";
import { InmemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

// const gymsRepository = new InmemoryGymsRepository();
// const CheckInUseCase = new CheckInUseCase(gymsRepository);

let gymsRepository: InmemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("fetch Nearby gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InmemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it("should be able fetch nearby gyms", async () => {
    await gymsRepository.create({
      title: "Near Gym",
      description: null,
      phone: "null",
      latitude: -23.6447814,
      longitude: -46.6424028,
    });

    await gymsRepository.create({
      title: "Far Gym",
      description: null,
      phone: "null",
      latitude: -22.4202326,
      longitude: -47.6821663,
    });

    const { gyms } = await sut.execute({
      userLatitude: -23.6447814,
      userLongitude: -46.6424028,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Near Gym" }),
    ]);
  });
});
