import { randomUUID } from "node:crypto";
import { Prisma, CheckIn } from "../../generated/prisma";
import { CheckInsRepository } from "../check-ins-repository";
import dayjs from "dayjs";

export class inMemorycheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = [];

  async findById(id: string) {
    const checkin = this.items.find((item) => item.id === id);

    if (!checkin) {
      return null;
    }

    return checkin;
  }

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

  async findByManyByUserId(userId: string, page: number) {
    return this.items
      .filter((item) => String(item.user_id) === userId)
      .slice((page - 1) * 20, page * 20);
  }
  async countByUserId(userId: string) {
    return this.items.filter((item) => String(item.user_id) === userId).length;
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    };

    this.items.push(checkIn);

    return checkIn;
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id);

    if (checkInIndex >= 0) {
      this.items[checkInIndex] = checkIn;
    }
    return checkIn;
  }
}
