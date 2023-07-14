import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, NatsContext } from '@nestjs/microservices';

import { KafkaService } from '@services/index';
import { v4 } from 'uuid';

import { Topic, TopicNames, Records, Aggregation } from '@models/index';
import { fetchStreamFlow } from '../aggregators';

@Controller('consumers')
export class ConsumerController {
  private readonly logger: Logger;

  constructor(private readonly kafkaService: KafkaService) {
    this.logger = new Logger(ConsumerController.name);
  }

  @EventPattern([
    Topic.AGE_RANGE,
    Topic.COUNTRY,
    Topic.COUNTRY_POSITION,
    Topic.PREF_FOOT,
  ])
  async handleAgeRangeEvent(
    @Payload() data: Records,
    @Ctx() context: NatsContext,
  ): Promise<any> {
    const subject = context.getSubject();
    const topicName: TopicNames = Topic[subject];
    const { aggregator, nextTopic } = fetchStreamFlow(topicName);

    this.logger.debug(`${subject} | ${topicName} | ${data.length}`);

    const results = aggregator(data);
    const aggregation = {
      key: v4(),
      from: subject,
      results,
    } as Aggregation;

    this.kafkaService
      .publish({
        data: aggregation,
        pattern: nextTopic,
      })
      .subscribe();

    return results;
  }

  @EventPattern(Topic.SUMMARY)
  async handleSummaryEvent(@Payload() data: Aggregation): Promise<any> {
    this.logger.log(`Summary: ${data.from}`, data.results);

    return data;
  }
}
