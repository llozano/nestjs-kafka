import { Topic } from './topic.enum';
import { Records } from './record.interface';

export interface StreamFlow {
  topic: Topic;
  aggregator: (data: Records) => { [key: string]: number };
  nextTopic: Topic;
}
