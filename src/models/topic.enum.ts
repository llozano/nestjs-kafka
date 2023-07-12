export enum Topic {
  COUNTRY = 'count:country',
  AGE_RANGE = 'count:age-range',
  PREF_FOOT = 'count:pref-foot',
  COUNTRY_POSITION = 'count:country:position',
  SUMMARY = 'summary',
}

export type TopicNames = keyof typeof Topic;
