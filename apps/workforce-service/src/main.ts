import { NestFactory } from "@nestjs/core";
import { WorkforceServiceModule } from "./workforce.module";

async function bootstrap() {
  const app = await NestFactory.create(WorkforceServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
