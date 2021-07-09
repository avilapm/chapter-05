import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;


describe("Get Balance", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const userCreated = await request(app).post("/api/v1/users").send({
      name: "test15",
      email: "test15@email.com",
      password: "1234"
    })

  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get balance", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "test15@email.com",
      password: "1234"
    });

    const { token } = responseToken.body;

    await request(app)
    .post("/api/v1/statements/deposit")
    .send({
      amount: 100,
      description: "100"
    }).set({
      Authorization: `Bearer ${token}`
    })

    await request(app)
    .post("/api/v1/statements/withdraw")
    .send({
      amount: 50,
      description: "50"
    }).set({
      Authorization: `Bearer ${token}`
    })

    const response = await request(app)
    .get("/api/v1/statements/balance")
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(200)
    expect(response.body.statement[0]).toHaveProperty("id")
    expect(response.body.statement[1]).toHaveProperty("id")
    expect(response.body).toHaveProperty("balance")
    expect(response.body.balance).toEqual(50)
  });

  it("should not be able to get balance from non-existing user", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "usernonexistent@email.com",
      password: "no-pass-1234",
    });

    expect(responseToken.status).toBe(401)
    expect(responseToken.body.message).toEqual('Incorrect email or password')
    expect(responseToken.body.token).toBe(undefined)
    const { token } = responseToken.body;

    const response = await request(app)
    .get("/api/v1/statements/balance")
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(401)
    expect(response.body.message).toEqual('JWT invalid token!')
  });
});