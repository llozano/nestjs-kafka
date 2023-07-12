import { Controller, OnModuleInit, Post, Param } from '@nestjs/common';
import { KafkaService, ProducerService } from './services';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly producerService: ProducerService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.kafkaService.connect();
  }

  @Post(':batchId')
  processDataset(@Param('batchId') batchId: string) {
    console.log('Processing: ', batchId);

    setTimeout(() => {
      this.producerService.process({ batchId });
    }, 10);
  }
}
