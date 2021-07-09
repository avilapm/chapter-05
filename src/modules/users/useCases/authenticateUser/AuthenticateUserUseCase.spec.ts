import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate a User", () => {
  beforeAll( () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

  });

  it("should be able to authenticate a user", async () => {
    const user: ICreateUserDTO = {
      name: "test",
      email: "test1@test.com",
      password: "1234"
    }

    const userCreated = await createUserUseCase.execute(user);


    const userAuthenticate = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    expect(userAuthenticate).toHaveProperty("token");
    expect(userAuthenticate.user.name).toEqual(user.name);

  });

  it("should not be able to authenticate an non existent user", async () => {

    expect(async () => {

      const user: ICreateUserDTO = {
        name: "test2",
        email: "test2@test.com",
        password: "1234"
      }

      const userCreated = await createUserUseCase.execute(user);

      const userAuthenticate = await authenticateUserUseCase.execute({
        email: "fakeemail@test.com",
        password: user.password
      });

    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate with incorrect password", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "test3",
        email: "test3@test.com",
        password: "1234"
      }

      const userCreated = await createUserUseCase.execute(user);

      const userAuthenticate = await authenticateUserUseCase.execute({
        email: user.name,
        password: "fake_password"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});