import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import 'dotenv/config';
import { UserModule } from './user.module';

async function bootstrap() {
  const host = process.env.USER_SERVICE_HOST ?? '127.0.0.1';
  const port = Number(process.env.USER_SERVICE_PORT ?? 3001);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.TCP,
      options: {
        host,
        port,
      },
    },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen();
  console.log(`User Microservice is listening on port ${port}`);
}
void bootstrap();
