import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { config } from './config/kafka.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(config);

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
