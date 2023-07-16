import { Controller, Logger } from '@nestjs/common';
import {
  EventPattern,
  Payload,
  Ctx,
  KafkaContext,
} from '@nestjs/microservices';

import { KafkaService } from '@services/index';
import { v4 } from 'uuid';

import { Topic, Records, Aggregation } from '@models/index';
import { fetchStreamFlow } from '../aggregators';

@Controller()
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
  async handleAggregatorEvents(
    @Payload() data: Records,
    @Ctx() context: KafkaContext,
  ): Promise<any> {
    const topic = <Topic>context.getTopic();
    // Determine what aggregator to apply
    const { aggregator, nextTopic } = fetchStreamFlow(topic);

    this.logger.log(`${topic} | ${data.length}`);

    const results = aggregator(data);
    const aggregation = {
      from: topic,
      results,
    } as Aggregation;

    // Stream to process on the next topic
    this.kafkaService.publish({
      data: { key: v4(), value: aggregation },
      pattern: nextTopic,
    });

    return results;
  }

  @EventPattern(Topic.SUMMARY)
  async handleSummaryEvent(@Payload() data: Aggregation): Promise<any> {
    this.logger.log(`Summary: ${data.from}`, data.results);

    return data;
  }
}
