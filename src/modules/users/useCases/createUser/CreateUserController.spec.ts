import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import request from "supertest";

let connection: Connection;

describe("Create User Controller", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  it("should be able to create a new user", async () => {
    const response = await request(app)
      .post("/api/v1/users")
      .send({ name: "test1", email: "test1@test.com.br", password: "1234" });

    expect(response.status).toBe(201);


  });

  it("should not be able to create user with same email", async () => {
    await request(app).post("/api/v1/users").send({
      name: "test2",
      email: "test2@email.com",
      password: "1234"
    })

    const response = await request(app).post("/api/v1/users").send({
      name: "test2",
      email: "test2@email.com",
      password: "1234"
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toEqual("User already exists")
  });


  afterAll( async () => {

    await connection.dropDatabase();
    await connection.close();

  });

});

