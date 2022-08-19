import { IUser } from 'src/user/user.interface';

export interface IProduct {
  id: string;
  name: string;
  price: number;
  owner: IUser;
}
