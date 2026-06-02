import { expect, describe, it, beforeEach } from "vitest";
import { InmemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsUseCase } from "./search-gyms";

// const gymsRepository = new InmemoryGymsRepository();
// const CheckInUseCase = new CheckInUseCase(gymsRepository);

let gymsRepository: InmemoryGymsRepository;
let sut: SearchGymsUseCase;

describe("Search gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InmemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it("should be able to search gyms", async () => {
    await gymsRepository.create({
      title: "JavaScript Gym",
      description: null,
      phone: "null",
      latitude: -23.6447814,
      longitude: -46.6424028,
    });

    await gymsRepository.create({
      title: "TypeScript Gym",
      description: null,
      phone: "null",
      latitude: -23.6447814,
      longitude: -46.6424028,
    });

    const { gyms } = await sut.execute({
      query: "JavaScript",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "JavaScript Gym" }),
    ]);
  });

  it("should be able to fetch paginated  gyms search", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `JavaScript Gym ${i}`, 
        description: null,
        phone: "null",
        latitude: -23.6447814,
        longitude: -46.6424028,
      });
    }
    const { gyms } = await sut.execute({
     query: "JavaScript",
     page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "JavaScript Gym 21" }),
      expect.objectContaining({ title: "JavaScript Gym 22" }),
    ]);
  });
});
