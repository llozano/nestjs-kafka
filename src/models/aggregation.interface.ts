export interface Aggregation {
  key: string;
  from: string;
  results: { [key: string]: number };
}
