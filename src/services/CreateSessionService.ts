import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import User from '../models/User';

interface Request {
  password: string;
  email: string;
}

interface Response {
  user: User;
  token: string;
}

export default class CreateSessionService {
  public async execute({ password, email }: Request): Promise<Response> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      throw Error('Incorrect email/password combination.');
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw Error('Incorrect email/password combination.');
    }

    const token = sign({}, '12f7e8ea8c0c6266d00b2bc8993680f7', {
      subject: user.id,
      expiresIn: '1d',
    });

    return { user, token };
  }
}
