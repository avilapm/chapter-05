import { Transfer } from "../entities/Transfer";
import { ICreateTransferDTO } from "../useCases/createTransfer/ICreateTransferDTO";

interface ITransfer {
  sender_id: string;
  receiver_id: string;
}

interface ITransferRepository {
  create(data: ITransfer): Promise<Transfer>;
}

export { ITransferRepository }