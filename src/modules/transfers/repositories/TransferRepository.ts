import { getRepository, Repository } from "typeorm";
import { Transfer } from "../entities/Transfer"
import { ICreateTransferDTO } from "../useCases/createTransfer/ICreateTransferDTO";

class TransferRepository {

  private repository: Repository<Transfer>;

  constructor() {
    this.repository = getRepository(Transfer);
  }

  async create({
    sender_id,
    receiver_id,
  }: ICreateTransferDTO): Promise<Transfer> {
    
    const transfer = this.repository.create({
      sender_id,
      receiver_id,
    });

    return this.repository.save(transfer);
  }

}

export { TransferRepository };