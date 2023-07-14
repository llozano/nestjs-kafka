import { Module } from '@nestjs/common';
import { ClientProxyFactory, CustomClientOptions } from '@nestjs/microservices';

import { AppController } from './app.controller';
import { FileService, KafkaService, ProducerService } from './services';
import { ConsumerController } from './consumers/consumer.controller';
import { SuperClientKafka } from './client/client-super-kafka';
import { config } from './config/kafka.config';

@Module({
  imports: [],
  controllers: [AppController, ConsumerController],
  providers: [
    FileService,
    {
      provide: SuperClientKafka,
      useFactory: () => {
        return ClientProxyFactory.create({
          options: config.options,
          customClass: SuperClientKafka,
        } as CustomClientOptions);
      },
    },
    {
      provide: KafkaService,
      useFactory: (client: SuperClientKafka) => {
        return new KafkaService(client);
      },
      inject: [SuperClientKafka],
    },
    ProducerService,
  ],
})
export class AppModule {}
