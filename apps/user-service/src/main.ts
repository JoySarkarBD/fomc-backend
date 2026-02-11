import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { UserServiceModule } from './user-service.module';

async function bootstrap() {
  const host = process.env.USER_SERVICE_HOST || '127.0.0.1';
  const port = parseInt(process.env.USER_SERVICE_PORT || '3001', 10);
  const app = await NestFactory.create(UserServiceModule);
  app.enableCors();
  await app.listen(port, host);
  console.log(`User Service API is listening on http://${host}:${port}`);
}
bootstrap();
