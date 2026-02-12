import { NestFactory } from "@nestjs/core";
import config from "../../config/config";
import { WorkforceModule } from "./workforce.module";

async function bootstrap() {
  const app = await NestFactory.create(WorkforceModule);
  await app.listen(config.PORT ?? 3000);
}
bootstrap();
