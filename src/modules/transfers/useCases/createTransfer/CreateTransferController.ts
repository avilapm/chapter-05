
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateTransferUseCase } from './CreateTransferUseCase';

class CreateTransferController {

  async execute(request: Request, response: Response) {

    const { id: sender_id } = request.user;
    const { receiver_id } = request.params
    const { amount, description } = request.body;

    const createTransferUseCase = container.resolve(CreateTransferUseCase);

    const statement = await createTransferUseCase.execute({
      sender_id,
      receiver_id,
      amount,
      description
    });

    return response.status(201).json(statement);

  }

}

export { CreateTransferController }