import { expect, describe, it } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InmemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

describe("Register Use Case", () => {
   it("should be able to register", async () => {
     const usersRepository = new InmemoryUsersRepository();
     const registerUseCase = new RegisterUseCase(usersRepository);

     const { user } = await registerUseCase.execute({
       name: "matheus",
       email: "mathe12181515@gmail.com",
       password: "123456",
     });


     expect(user.id).toEqual(expect.any(Number));
   });

  
  it("should hash user password upon registration", async () => {
    const usersRepository = new InmemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "matheus",
      email: "mathe12181515@gmail.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.passwordHash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    const usersRepository = new InmemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const email = "mathe1@gmail.com";

    await registerUseCase.execute({
      name: "matheus",
      email,
      password: "123456",
    });

    expect(() =>
      registerUseCase.execute({
        name: "matheus",
        email,
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
