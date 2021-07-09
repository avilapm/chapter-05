import request from "supertest";
import { Connection, createConnection } from "typeorm";
import {v4 as uuidv4 } from "uuid"


import { app } from "../../../../app";

let connection: Connection;

describe("Get Statement", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const userCreated = await request(app).post("/api/v1/users").send({
      name: "test16",
      email: "test16@email.com",
      password: "1234"
    })

  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get statement", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test16@email.com",
      password: "1234"
    });

    const { token } = responseToken.body;

    const responseDeposit = await request(app)
    .post("/api/v1/statements/deposit")
    .send({
      amount: 100,
      description: "100"
    }).set({
      Authorization: `Bearer ${token}`
    })

    const statement_id = responseDeposit.body.id

    const response = await request(app)
    .get(`/api/v1/statements/${statement_id}`)
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("id")
    expect(response.body.amount).toEqual("100.00")
    expect(response.body.type).toEqual("deposit")
  });

  it("should be not able to get statement from non-existing user", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "usernonexistent@email.com",
      password: "no-pass-1234",
    });

    expect(responseToken.status).toBe(401)
    expect(responseToken.body.message).toEqual('Incorrect email or password')
    expect(responseToken.body.token).toBe(undefined)
    const { token } = responseToken.body;

    const statement_id = uuidv4()
    const response = await request(app)
    .get(`/api/v1/statements/${statement_id}`)
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(401)
    expect(response.body.message).toEqual('JWT invalid token!')
  });

  it("should be not able to get non-existing statement", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test16@email.com",
      password: "1234"
    });

    const { token } = responseToken.body;

    const statement_id = uuidv4()
    const response = await request(app)
    .get(`/api/v1/statements/${statement_id}`)
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(404)
    expect(response.body.message).toEqual('Statement not found')
  });
});