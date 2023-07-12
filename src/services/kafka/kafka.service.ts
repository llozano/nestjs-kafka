import { Injectable } from '@nestjs/common';
import { Client, ReadPacket } from '@nestjs/microservices';
import { Producer } from 'kafkajs';

import { SuperClientKafka } from '../../client/client-super-kafka';
import { config } from '../../config/kafka.config';

import { Observable } from 'rxjs';

@Injectable()
export class KafkaService {
  @Client(config)
  private client: SuperClientKafka;

  async connect(): Promise<Producer> {
    return await this.client.connect();
  }

  publishBatch<T = any>(packet: ReadPacket<T>[]): Observable<T> {
    return this.client.sendBatch<T>(packet);
  }

  publish<T = any>(packet: ReadPacket<T>): Observable<T> {
    return this.client.emit(packet.pattern, packet.data);
  }
}
