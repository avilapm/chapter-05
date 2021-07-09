import { OperationType } from './../../entities/Statement';
import { CreateUserUseCase } from './../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { GetBalanceUseCase } from './GetBalanceUseCase';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { GetBalanceError } from './GetBalanceError';
import { ICreateUserDTO } from '../../../users/useCases/createUser/ICreateUserDTO';

let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;

describe("Get Balance", () => {
  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository()
    usersRepositoryInMemory = new InMemoryUsersRepository()
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory)
    getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, usersRepositoryInMemory)
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  })

  it("should be able to get balance", async () => {
    const user: ICreateUserDTO = {
      email: "teste10@teste10.com",
      password: "1234",
      name: "User Test",
    };

    const userCreated = await createUserUseCase.execute(user);

    expect(userCreated).toHaveProperty("id");
    const user_id = userCreated.id as string

    await createStatementUseCase.execute({
      user_id,
      type: OperationType.DEPOSIT,
      amount: 200,
      description: "TEST DEPOSIT",
    })

    const balance = await getBalanceUseCase.execute({user_id})

    expect(balance.statement[0]).toHaveProperty("id")
    expect(balance.statement.length).toBe(1)
    expect(balance.balance).toEqual(200)
  })

  it("should not be able to get balance from non-existing user", async () => {
    expect(async () => {
      const user_id = "user_non_existent"
      await getBalanceUseCase.execute({user_id})
    }).rejects.toBeInstanceOf(GetBalanceError)
  })
})