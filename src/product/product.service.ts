import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from 'src/user/user.interface';
import { UserDocument } from 'src/user/user.schema';
import { NewProductDTO } from './product.dto';
import { IProduct } from './product.interface';
import { ProductDocument } from './product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>,
  ) {}

  _getIProduct(product: ProductDocument, owner: IUser): IProduct {
    return {
      id: product._id,
      name: product.name,
      price: product.price,
      owner: owner,
    };
  }

  async create(name: string, price: number, owner: IUser): Promise<IProduct> {
    const newProduct = new this.productModel({
      name,
      price,
      ownerId: owner.id,
    });

    const product = await newProduct.save();

    return this._getIProduct(product, owner);
  }

  async findAll(owner: IUser, params: object = {}): Promise<IProduct[] | null> {
    let result = await this.productModel
      .find({ ...params, ownerId: owner.id })
      .exec();

    let list = result.map(
      (item: ProductDocument): IProduct => this._getIProduct(item, owner),
    );

    return list;
  }

  async findById(id: string, owner: IUser): Promise<IProduct | null> {
    const product = await this.productModel
      .findOne({ _id: id, ownerId: owner.id })
      .exec();

    if (!product) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: ['Product not exists or you are not the owner'],
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return this._getIProduct(product, owner);
  }

  async delete(id: string, owner: IUser): Promise<IProduct | null> {
    const existingProduct = await this.findById(id, owner);

    const product = await this.productModel.findByIdAndDelete(
      existingProduct.id,
    );
    return this._getIProduct(product, owner);
  }

  async update(
    id: string,
    NewProductDTO: NewProductDTO,
    owner: IUser,
  ): Promise<IProduct | null> {
    const existingProduct = await this.findById(id, owner);

    const product = await this.productModel.findByIdAndUpdate(
      existingProduct.id,
      NewProductDTO,
      { new: true },
    );
    return this._getIProduct(product, owner);
  }
}
