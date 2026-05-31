import { randomUUID } from "node:crypto";
import { Prisma, CheckIn } from "../../generated/prisma";
import { CheckInsRepository } from "../check-ins-repository";
import dayjs from "dayjs";

export class inMemorycheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = [];

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");

    const checkinOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const inOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

      return String(checkIn.user_id) === userId && inOnSameDate;
    });

    if (!checkinOnSameDate) {
      return null;
    }

    return checkinOnSameDate;
  }

  async findByManyByUserId(userId: string) {
    return this.items.filter((item) => String(item.user_id) === userId);
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      valdated_at: data.valdated_at ? new Date(data.valdated_at) : null,
      created_at: new Date(),
    };

    this.items.push(checkIn);

    return checkIn;
  }
}
