import request from "supertest";
import { app } from "../../../app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { randomUUID } from "node:crypto";
import { createAndAuthenticateUser } from "@/use-cases/create-and-authenticate-user";
import { title } from "node:process";

describe("create Gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a gym", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const response = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Javascript Gym",
        description: "Some description",
        phone: "11999999999",
        latitude: -23.6447814,
        longitude: -46.6424028,
      });

    expect(response.statusCode).toEqual(201);
    
  });
});
