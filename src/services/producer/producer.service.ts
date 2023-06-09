import { Injectable } from '@nestjs/common';
import { ReadPacket } from '@nestjs/microservices';

import { FileService } from '../file/file.service';
import { KafkaService } from '../kafka/kafka.service';
import { config } from '../../config/app.config';
import { Record, Records, Topic } from '@models/index';

import { mergeMap, bufferCount, map, tap } from 'rxjs/operators';

@Injectable()
export class ProducerService {
  constructor(
    private fileService: FileService,
    private kafkaService: KafkaService,
  ) {}

  process(info: any): void {
    const { bufferSize } = config;
    const { datasetId } = info;

    this.fileService
      .read(info)
      .pipe(
        bufferCount(bufferSize),
        // tap((records) => {
        //   console.log('Batch size of', datasetId, records.length);
        // }),
        map((records) => this.createBatchMessage(records)),
        mergeMap((packets) => {
          return this.kafkaService.publishBatch<Record>(packets);
        }),
      )
      .subscribe((_) => {
        /*  */
      });
  }

  private createBatchMessage(records: Records): ReadPacket[] {
    return [
      { pattern: Topic.AGE_RANGE, data: [...records] },
      { pattern: Topic.COUNTRY, data: [...records] },
      { pattern: Topic.COUNTRY_POSITION, data: [...records] },
      { pattern: Topic.PREF_FOOT, data: [...records] },
    ];
  }
}
