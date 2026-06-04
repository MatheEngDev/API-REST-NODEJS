import { expect, describe, it, beforeEach } from "vitest";
import { RegisterUseCase } from "./register";
import { InmemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { InmemoryGymsRepository } from "../repositories/in-memory/in-memory-gyms-repository";
import { createGymUseCase } from "./create-gym";

let gymsRepository: InmemoryGymsRepository;
let sut: createGymUseCase;

describe("create gym Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InmemoryGymsRepository();
    sut = new createGymUseCase(gymsRepository);
  });

  it("should be able to create gym", async () => {
    const { gym } = await sut.execute({
      title: "JavaScript Gym",
      description:null,
      phone:'null',
      latitude: -23.6447814,
      longitude: -46.6424028,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
