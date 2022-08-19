import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  //
  const config = new DocumentBuilder()
    .setTitle('Nest Products API')
    .setDescription('The products API for challenge')
    .setVersion('1.0')
    .addTag('challenge')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
