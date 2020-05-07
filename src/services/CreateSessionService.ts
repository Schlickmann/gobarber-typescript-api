import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';

import User from '../models/User';

interface Request {
  password: string;
  email: string;
}

interface Response {
  user: User;
}

export default class CreateSessionService {
  public async execute({ password, email }: Request): Promise<Response> {
    const userRepository = getRepository(User);

    const userExists = await userRepository.findOne({ where: { email } });

    if (!userExists) {
      throw Error('Incorrect email/password combination.');
    }

    const passwordMatched = await compare(password, userExists.password);

    if (!passwordMatched) {
      throw Error('Incorrect email/password combination.');
    }

    return { user: userExists };
  }
}
