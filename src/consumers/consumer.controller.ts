import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, NatsContext } from '@nestjs/microservices';

import { KafkaService } from '@services/';
import { nanoid } from 'nanoid';

import { Topic, TopicNames, Records, Aggregation } from '@models/';
import { fetchStreamFlow } from '../aggregators';

@Controller('consumers')
export class ConsumerController {
  constructor(private readonly kafkaService: KafkaService) {}

  @EventPattern('count:*')
  async handleAgeRangeEvent(
    @Payload() data: Records,
    @Ctx() context: NatsContext,
  ): Promise<void> {
    const subject = context.getSubject();
    const topicName: TopicNames = Topic[subject];
    const { aggregator, nextTopic } = fetchStreamFlow(topicName);

    const results = aggregator(data);
    const aggregation = {
      key: nanoid(),
      from: subject,
      results,
    } as Aggregation;

    this.kafkaService.publish({
      data: aggregation,
      pattern: nextTopic,
    });
  }

  @EventPattern(Topic.SUMMARY)
  async handleSummaryEvent(@Payload() data: Aggregation): Promise<void> {
    //
  }
}
