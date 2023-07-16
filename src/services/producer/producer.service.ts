import { Injectable } from '@nestjs/common';
import { ReadPacket } from '@nestjs/microservices';

import { FileService } from '../file/file.service';
import { KafkaService } from '../kafka/kafka.service';
import { config } from '../../config/app.config';
import { Record, Records, Topic } from '@models/index';

import { v4 } from 'uuid';
import { mergeMap, bufferCount, map, tap } from 'rxjs/operators';

@Injectable()
export class ProducerService {
  constructor(
    private fileService: FileService,
    private kafkaService: KafkaService,
  ) {}

  /**
   * Process data set
   * @param info  dataset info
   */
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
      .subscribe();
  }

  /**
   * Hardwire a list of Records to each of the patterns (topics) that constitute
   * a batch
   * @param  records               list of Records
   * @return         list of packets
   */
  private createBatchMessage(records: Records): ReadPacket[] {
    return [
      { pattern: Topic.AGE_RANGE, data: { key: v4(), value: [...records] } },
      { pattern: Topic.COUNTRY, data: { key: v4(), value: [...records] } },
      {
        pattern: Topic.COUNTRY_POSITION,
        data: { key: v4(), value: [...records] },
      },
      { pattern: Topic.PREF_FOOT, data: { key: v4(), value: [...records] } },
    ];
  }
}
