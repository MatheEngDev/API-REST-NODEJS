import { expect, describe, it, beforeEach } from "vitest";
import { InmemoryUsersRepository } from "./../repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";


let usersRepository = new InmemoryUsersRepository();
let sut = new AuthenticateUseCase(usersRepository);


describe("authenticate Use Case", () => {
beforeEach (() => {
   usersRepository = new InmemoryUsersRepository();
   sut = new AuthenticateUseCase(usersRepository);

})

  it("should be able to authenticate", async () => {
    
    await usersRepository.create({
      name: "matheus",
      email: "mathe12181515@gmail.com",
      passwordHash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "mathe12181515@gmail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(Number));
  });

  it("should not be able to authenticate with wrong email", async () => {
   await expect(() =>
      sut.execute({
        email: "mathe12181515@gmail.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await usersRepository.create({
      name: "matheus",
      email: "mathe12181515@gmail.com",
      passwordHash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        email: "mathe12181515@gmail.com",
        password: "321654",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
  
});
