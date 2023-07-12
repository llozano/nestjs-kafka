import {
  ClientKafka,
  KafkaOptions,
  ReadPacket,
  OutgoingEvent,
} from '@nestjs/microservices';

import { isNil } from '@nestjs/common/utils/shared.utils';
import { InvalidMessageException } from '@nestjs/microservices/errors/invalid-message.exception';
import { connectable, defer, Observable, Subject, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { TopicMessages } from 'kafkajs';

export class SuperClientKafka extends ClientKafka {
  constructor(protected readonly options: KafkaOptions['options']) {
    super(options);
  }

  /**
   * Send a batch
   * @param  ({data,pattern}               list of packets to be published
   * @return                 hot Observable
   */
  public sendBatch<TResult = any, TInput = any>(
    batchPacket: ReadPacket<TInput>[],
  ): Observable<TResult> {
    batchPacket.forEach(({ data, pattern }) => {
      if (
        isNil(pattern) ||
        isNil(data) ||
        !Array.isArray(data) ||
        data.length === 0
      ) {
        return throwError(() => new InvalidMessageException());
      }
    });

    const source = defer(async () => this.connect()).pipe(
      mergeMap(() => this.dispatchBachEvent(batchPacket)),
    );

    const connectableSource = connectable(source, {
      connector: () => new Subject(),
      resetOnDisconnect: false,
    });
    connectableSource.connect();

    return connectableSource;
  }

  /**
   * Dispatch a batch
   * @param  batchPacket               batch packet
   * @return             Promise of RecordMetadata[]
   */
  protected async dispatchBachEvent(
    batchPacket: OutgoingEvent[],
  ): Promise<any> {
    const topicMessages: TopicMessages[] = [];

    for await (const packet of batchPacket) {
      const pattern = this.normalizePattern(packet.pattern);
      const outgoingEvent = await this.serializer.serialize(packet.data, {
        pattern,
      });

      topicMessages.push({
        topic: pattern,
        messages: [outgoingEvent],
      });
    }

    return this.producer.sendBatch({ topicMessages });
  }
}
