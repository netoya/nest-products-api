import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { NewProductDTO } from './product.dto';
import { IProduct } from './product.interface';
import { ProductService } from './product.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/')
  async getProducts(@Request() req: any) {
    const { user } = req;
    const products = await this.productService.findAll(user);
    return products;
  }

  @Post('/')
  createProduct(
    @Request() req: any,
    @Body() product: NewProductDTO,
  ): Promise<IProduct | null> {
    const { user } = req;
    return this.productService.create(product.name, product.price, user);
  }

  @ApiParam({ name: 'id', type: String })
  @Get('/:id')
  async getProduct(@Request() req, @Param('id') id) {
    const { user } = req;
    const product = await this.productService.findById(id, user);
    if (!product) throw new NotFoundException('Product does not exist!');
    return product;
  }

  @ApiParam({ name: 'id', type: String })
  @Put('/:id')
  async updateProduct(
    @Request() req,
    @Body() NewProductDTO: NewProductDTO,
    @Param('id') id,
  ) {
    const { user } = req;
    const product = await this.productService.update(id, NewProductDTO, user);
    return {
      message: 'Product updated successfully',
      product,
    };
  }

  @ApiParam({ name: 'id', type: String })
  @Delete('/:id')
  async deleteProduct(@Request() req, @Param('id') id) {
    const { user } = req;
    const product = await this.productService.delete(id, user);
    return {
      message: 'Product deleted successfully',
      product,
    };
  }
}
