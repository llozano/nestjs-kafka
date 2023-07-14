import { Records, StreamFlow, Topic, TopicNames } from '@models/index';

const countByCountry = (data: Records): { [key: string]: number } => {
  const result = {};

  data.forEach((record) => {
    const { nationality } = record;

    result[nationality] = 1 + result[nationality] ?? 0;
  });

  return result;
};

const ageRange = (data: Records): { [key: string]: number } => {
  const result = {};

  data.forEach((record) => {
    const { age = 0 } = record;
    const range =
      age > 0 ? `${Math.floor(age / 5) * 5}-${Math.ceil(age / 5) * 5}` : 'N/A';

    result[range] = 1 + result[range] ?? 0;
  });

  return result;
};

const countByPreferredFoot = (data: Records): { [key: string]: number } => {
  const result = {};

  data.forEach((record) => {
    const { preferred_foot: preferredFoot } = record;
    const foot = preferredFoot?.split(',')[0]?.trim() ?? 'N/A';

    result[foot] = 1 + result[foot] ?? 0;
  });

  return result;
};

const countPositionByCountry = (data: Records): { [key: string]: number } => {
  const result = {};

  data.forEach((record) => {
    const { nationality, team_position, player_positions } = record;
    const position =
      !team_position || team_position.length === 0
        ? player_positions?.split(',')[0]?.trim() ?? 'N/A'
        : team_position;
    const group = `${nationality}::${position}`;

    result[group] = 1 + result[group] ?? 0;
  });

  return result;
};

const streamFlowMap: { [key: string]: StreamFlow } = {
  COUNTRY: {
    topic: Topic.COUNTRY,
    aggregator: countByCountry,
    nextTopic: Topic.SUMMARY,
  },
  AGE_RANGE: {
    topic: Topic.AGE_RANGE,
    aggregator: ageRange,
    nextTopic: Topic.SUMMARY,
  },
  PREF_FOOT: {
    topic: Topic.PREF_FOOT,
    aggregator: countByPreferredFoot,
    nextTopic: Topic.SUMMARY,
  },
  COUNTRY_POSITION: {
    topic: Topic.COUNTRY_POSITION,
    aggregator: countPositionByCountry,
    nextTopic: Topic.SUMMARY,
  },
};

export const fetchStreamFlow = (
  topicName: TopicNames,
): StreamFlow | undefined => {
  return streamFlowMap[topicName];
};
