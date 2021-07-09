import { OperationType, Statement } from "../entities/Statement";

export class BalanceMap {
  static toDTO({ statement, balance }: { statement: Statement[], balance: number }) {


    /*  const parsedStatement = statement.map(({
       id,
       transfer_id,
       transfer,
       amount,
       description,
       type,
       created_at,
       updated_at
     }) => ({
       id,
       amount: Number(amount),
       receiver_id: transfer_id ? transfer.receiver_id : null,
       description,
       type: transfer_id ? OperationType.TRANSFER : type,
       created_at,
       updated_at
     }
     )); */

    const parsedStatement = statement.map( (st) => {

      if (st.transfer_id !== null) {
        return {
          id: st.id,
          receiver_id: st.transfer.receiver_id,
          amount: Number(st.amount),
          description: st.description,
          type: OperationType.TRANSFER,
          created_at: st.created_at,
          updated_at: st.updated_at

        };
      } else {
        return {
          id: st.id,
          amount: Number(st.amount),
          description: st.description,
          type: st.type,
          created_at: st.created_at,
          updated_at: st.updated_at
        }
      }
    });

    return {
      statement: parsedStatement,
      balance: Number(balance)
    }
  }
}
