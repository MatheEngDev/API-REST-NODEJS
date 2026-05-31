import { UsersRepository } from "../repositories/users-repository";
import { User } from "../generated/prisma";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface getUserProfileUseCaseRequest {
  userId: string;
}

interface getUserProfileUseCaseResponse {
  user: User;
}

export class getUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: getUserProfileUseCaseRequest): Promise<getUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return {
      user,
    };
  }
}
