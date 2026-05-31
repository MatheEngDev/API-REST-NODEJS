import { User, Prisma } from "../../generated/prisma";
import { UsersRepository } from "../users-repository";

export class InmemoryUsersRepository implements UsersRepository {
  public items: User[] = [];
  sequence = 1;
  async findById(id: string) {
    const user = this.items.find((item) => item.id === Number(id));

    if (!user) {
      return null;
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: this.sequence++,
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      created_at: new Date(),
    };

    this.items.push(user);

    return user;
  }
}
