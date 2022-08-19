import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { IUser } from './user.interface';

import { UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  _getIUser(user: UserDocument): IUser {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
    };
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) return null;
    return this._getIUser(user);
  }

  async create(
    name: string,
    email: string,
    hashedPassword: string,
  ): Promise<UserDocument> {
    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });

    return newUser.save();
  }
}
