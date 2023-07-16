import { Transport, KafkaOptions } from '@nestjs/microservices';

export const config = {
  name: 'kafka-poc',
  options: {
    client: {
      clientId: 'd-client',
      brokers: ['localhost:39092', 'localhost:29092'],
    },
    producer: {
      allowAutoTopicCreation: true,
      transactionTimeout: 30000,
    },
    consumer: {
      groupId: 'cool-b-consumer',
      allowAutoTopicCreation: true,
    },
    producerOnlyMode: !!process.env.PRODUCE_ONLY_MODE,
  } as KafkaOptions['options'],
  transport: Transport.KAFKA,
};
