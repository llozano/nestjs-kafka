import { Transport, KafkaOptions } from '@nestjs/microservices';

export const config = {
  name: 'kafka-poc',
  options: {
    client: {
      brokers: ['127.0.0.1:39092', '127.0.0.1:29092'],
    },
    producer: {
      allowAutoTopicCreation: true,
      transactionTimeout: 30000,
    },
    consumer: {
      groupId: 'd-group',
      allowAutoTopicCreation: true,
    },
    producerOnlyMode: !!process.env.PRODUCE_ONLY_MODE,
  },
  transport: Transport.KAFKA,
} as KafkaOptions;
