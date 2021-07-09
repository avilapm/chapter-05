import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create an User", () => { 

  beforeEach( async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {

    const user_one: ICreateUserDTO = {
      name: "test5",
      email: "test5@test.com",
      password: "1234"
    }

    const userCreated = await createUserUseCase.execute(user_one);

    expect(userCreated).toHaveProperty("id");
    expect(userCreated).toHaveProperty("name");
    expect(userCreated).toHaveProperty("email");
    expect(userCreated).toHaveProperty("password");

  });


  it("should be not able to create an user already exists", async () => {

   expect( async () => {
    const user_one: ICreateUserDTO = {
      name: "test6",
      email: "test6@test.com",
      password: "1234"
    }

    const userCreated = await createUserUseCase.execute(user_one);
    const sameUserNotCreate = await createUserUseCase.execute(user_one);

   }).rejects.toBeInstanceOf(CreateUserError)

  });


});