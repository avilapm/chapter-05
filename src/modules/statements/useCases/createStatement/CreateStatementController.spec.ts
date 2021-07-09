import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;


describe("Create Statement", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const userCreated = await request(app).post("/api/v1/users").send({
      name: "test14",
      email: "test14@test.com",
      password: "1234"
    });

    
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to deposit", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test14@test.com",
      password: "1234",
    });

    const { token } = responseToken.body;

    const response = await request(app)
    .post("/api/v1/statements/deposit")
    .send({
      amount: 100,
      description: "100"
    }).set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id")
    expect(response.body.amount).toBe(100)
    expect(response.body.type).toEqual("deposit")
  });

  it("should be able to withdraw", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test14@test.com",
      password: "1234",
    });

    const { token } = responseToken.body;

    const response = await request(app)
    .post("/api/v1/statements/withdraw")
    .send({
      amount: 100,
      description: "100"
    }).set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id")
    expect(response.body.amount).toBe(100)
    expect(response.body.type).toEqual("withdraw")
  });

  it("should not be able to deposit/withdraw with non-existing user", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "usernonexistent@email.com",
      password: "no-pass-1234",
    });

    expect(responseToken.status).toBe(401)
    expect(responseToken.body.message).toEqual('Incorrect email or password')
    expect(responseToken.body.token).toBe(undefined)
    const { token } = responseToken.body;

    const response = await request(app)
    .post("/api/v1/statements/deposit")
    .send({
      amount: 100,
      description: "100"
    }).set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(401)
    expect(response.body.message).toEqual('JWT invalid token!')
  });

  it("should not be able to withdraw without money", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test14@test.com",
      password: "1234",
    });

    const { token } = responseToken.body;

    const response = await request(app)
    .post("/api/v1/statements/withdraw")
    .send({
      amount: 100,
      description: "100"
    }).set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toEqual('Insufficient funds')
  });
});