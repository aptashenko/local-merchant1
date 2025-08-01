import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
    },
  });

  app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,      // убирает лишние поля
        forbidNonWhitelisted: true, // выбрасывает ошибку, если пришло что-то лишнее
        transform: true,      // приводит к нужному типу
      }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
