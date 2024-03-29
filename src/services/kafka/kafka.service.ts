import { Injectable } from '@nestjs/common';
import { ReadPacket } from '@nestjs/microservices';
import { Producer } from 'kafkajs';

import { SuperClientKafka } from '../../client/client-super-kafka';

import { Observable } from 'rxjs';

@Injectable()
export class KafkaService {
  constructor(private client: SuperClientKafka) {}

  async connect(): Promise<Producer> {
    return await this.client.connect();
  }

  async close(): Promise<void> {
    await this.client.close();
  }

  publishBatch<T = any>(packet: ReadPacket<T>[]): Observable<T> {
    return this.client.sendBatch<T>(packet);
  }

  publish<T = any>(packet: ReadPacket<T>): Observable<T> {
    return this.client.emit(packet.pattern, packet.data);
  }
}
