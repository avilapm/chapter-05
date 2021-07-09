import exp from "constants";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create a Statement", () => {

  beforeEach( () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);

  });

  it("should not be able to deposit and withdraw from a non-existent user", async () => {
    expect( async () => {
      const statement: ICreateStatementDTO = {
        user_id: "non-existent-user-1111",
        description: "deposit to test",
        type: OperationType.DEPOSIT,
        amount: 1200.00
      }
  
      await createStatementUseCase.execute(statement);
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it("should be able to deposit", async () => {

      const user: ICreateUserDTO = {
        name: "test7",
        email: "email7@test.com",
        password: "1234"
      }

      const userCreated = await createUserUseCase.execute(user);
    
      const statement: ICreateStatementDTO = {
        user_id:  userCreated.id as string,
        description: "deposit to test",
        type: OperationType.DEPOSIT,
        amount: 1200.00
      }
  
      const statementCreated = await createStatementUseCase.execute(statement);
      
      expect(statementCreated.amount).toEqual(1200.00);
      expect(statementCreated.user_id).toEqual(userCreated.id);
    
  })


  it("should be able to withdraw", async () => {

    const user: ICreateUserDTO = {
      name: "test8",
      email: "email8@test.com",
      password: "1234"
    }

    const userCreated = await createUserUseCase.execute(user);
  
    const statement_deposit: ICreateStatementDTO = {
      user_id:  userCreated.id as string,
      description: "deposit to test",
      type: OperationType.DEPOSIT,
      amount: 1200.00
    }

    const statement_withdraw: ICreateStatementDTO = {
      user_id:  userCreated.id as string,
      description: "withdraw to test",
      type: OperationType.WITHDRAW,
      amount: 1000.00
    }

    await createStatementUseCase.execute(statement_deposit);
    const statementCreated = await createStatementUseCase.execute(statement_withdraw);
    
    expect(statementCreated.amount).toEqual(1000.00);
    expect(statementCreated.user_id).toEqual(userCreated.id);
  
})

it("should not be able to withdraw without money", async () => {

  expect(async ()=> {
    const user: ICreateUserDTO = {
      name: "test9",
      email: "email9@test.com",
      password: "1234"
    }
  
    const userCreated = await createUserUseCase.execute(user);
  
    const statement_deposit: ICreateStatementDTO = {
      user_id:  userCreated.id as string,
      description: "deposit to test",
      type: OperationType.DEPOSIT,
      amount: 1200.00
    }
  
    const statement_withdraw: ICreateStatementDTO = {
      user_id:  userCreated.id as string,
      description: "withdraw to test",
      type: OperationType.WITHDRAW,
      amount: 1500.00
    }
  
    await createStatementUseCase.execute(statement_deposit);
    await createStatementUseCase.execute(statement_withdraw);
    
  
  }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);

})

});