import { User, Prisma } from "../../generated/prisma";
import { UsersRepository } from "../users-repository";

export class InmemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: 1,
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      created_at: new Date(),
    };

    this.items.push(user);

    return user;
  }
}
