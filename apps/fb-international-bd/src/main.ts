import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = parseInt(process.env.MAIN_GATEWAY_PORT || '3000', 10);
  await app.listen(port);
  console.log(`Main service is listening on port ${port}`);
}
bootstrap();
