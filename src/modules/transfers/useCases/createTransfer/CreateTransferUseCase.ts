import { inject, injectable } from "tsyringe";
import { OperationType } from "../../../statements/entities/Statement";
import { IStatementsRepository } from "../../../statements/repositories/IStatementsRepository";
import { CreateStatementError } from "../../../statements/useCases/createStatement/CreateStatementError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { TransferMap } from "../../mappers/TransferMap";
import { ITransferRepository } from "../../repositories/ITransferRepository";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

@injectable()
class CreateTransferUseCase {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,

    @inject('TransferRepository')
    private transferRepository: ITransferRepository

  ) { }

  async execute({ sender_id, receiver_id, amount, description }: ICreateTransferDTO) {

    const senderUser = await this.usersRepository.findById(sender_id);
    const type = OperationType.TRANSFER;

    if (!senderUser) {
      throw new CreateStatementError.UserNotFound();
    }

    const receiverUser = await this.usersRepository.findById(receiver_id);

    if (!receiverUser) {
      throw new CreateStatementError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

    if (balance < amount) {
      throw new CreateStatementError.InsufficientFunds()
    }

    const transferOperation = await this.transferRepository.create({
      sender_id,
      receiver_id,
    });

    
    const { id } = transferOperation;

    if(! id){
      throw new CreateStatementError.CreateTransferError()
    }

    const statementOperationWithdraw = await this.statementsRepository.create({
      user_id: sender_id,
      type: OperationType.WITHDRAW,
      amount,
      description,
      transfer_id: id,
    });

    const statementOperationDeposit = await this.statementsRepository.create({
      user_id: receiver_id,
      type: OperationType.DEPOSIT,
      amount,
      description,
      transfer_id: id,
    });

    return transferOperation;

  }

}

export { CreateTransferUseCase }