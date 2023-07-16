import {
  Controller,
  OnModuleInit,
  OnModuleDestroy,
  Post,
  Param,
} from '@nestjs/common';
import { KafkaService, ProducerService } from './services';

@Controller()
export class AppController implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly producerService: ProducerService,
  ) {}

  async onModuleInit(): Promise<any> {
    return await this.kafkaService.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.kafkaService.close();
  }

  @Post('process/:datasetId')
  processDataset(@Param('datasetId') datasetId: string) {
    console.log('Processing: ', datasetId);

    setTimeout(() => {
      this.producerService.process({ datasetId });
    }, 10);
  }
}
