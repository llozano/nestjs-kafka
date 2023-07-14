import { Controller, OnModuleInit, Post, Param } from '@nestjs/common';
import { KafkaService, ProducerService } from './services';
import { Topic } from './models';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly producerService: ProducerService,
  ) {}

  async onModuleInit(): Promise<void> {
    const topics = [
      Topic.AGE_RANGE,
      Topic.COUNTRY,
      Topic.COUNTRY_POSITION,
      Topic.PREF_FOOT,
    ];
    this.kafkaService.subscribeTopics(topics);

    await this.kafkaService.connect();
  }

  @Post('process/:datasetId')
  processDataset(@Param('datasetId') datasetId: string) {
    console.log('Processing: ', datasetId);

    setTimeout(() => {
      this.producerService.process({ datasetId });
    }, 10);
  }
}
