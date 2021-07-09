import { OperationType, Statement } from "../../entities/Statement";

/* export type ICreateStatementDTO =
Pick<
  Statement,
  'user_id' |
  'description' |
  'amount' |
  'type' | 
  'transfer_id'
> */

interface ICreateStatementDTO {

  user_id: string;
  description: string;
  amount: number,
  type: OperationType,
  transfer_id?: string;

}

export { ICreateStatementDTO };