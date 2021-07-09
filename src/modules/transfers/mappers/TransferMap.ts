import { Transfer } from "../entities/Transfer";

export class TransferMap {
  static toDTO({ id, sender_id, receiver_id, created_at }: Transfer) {
    return {
      id,
      sender_id,
      receiver_id,
      created_at,
    }
  }
}