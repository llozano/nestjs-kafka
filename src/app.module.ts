import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { FileService, KafkaService, ProducerService } from './services';
import { ConsumerController } from './consumers/consumer.controller';

@Module({
  imports: [],
  controllers: [AppController, ConsumerController],
  providers: [FileService, KafkaService, ProducerService],
})
export class AppModule {}
