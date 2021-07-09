import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show User's Profile", () => {
  beforeEach( () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to show user's profile", async () => {

    const user_one: ICreateUserDTO = {
      name: "test4",
      email: "test4@test.com",
      password: "1234"
    }

    const userCreated = await createUserUseCase.execute(user_one);
    const userProfile = await showUserProfileUseCase.execute(userCreated.id as string); 

    expect(userProfile).toHaveProperty("id");
    expect(userProfile).toHaveProperty("name");
    expect(userProfile).toHaveProperty("email");
    expect(userProfile).toHaveProperty("password");
  });

  

  it("should not be able to show user's profile of a invalid user", async () => {
    expect(async () => {
      const userProfile = await showUserProfileUseCase.execute("1234"); 
    }).rejects.toBeInstanceOf(ShowUserProfileError);
   
  });

});

