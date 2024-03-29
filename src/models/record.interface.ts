/**
 * A football player model
 */
export interface Record {
  sofifa_id: number;
  player_url: string;
  short_name: string;
  long_name: string;
  age: number;
  dob: string;
  height_cm: number;
  weight_kg: number;
  nationality: string;
  club: string;
  overall: number;
  potential: number;
  value_eur: number;
  wage_eur: number;
  player_positions: string;
  preferred_foot: string;
  international_reputation: number;
  weak_foot: number;
  skill_moves: number;
  work_rate: string;
  body_type: string;
  real_face: boolean;
  release_clause_eur: number;
  player_tags: string;
  team_position: string;
  team_jersey_number: number;
  loaned_from: any;
  joined: string;
  contract_valid_until: number;
  nation_position: any;
  nation_jersey_number: any;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physic: number;
  gk_diving: any;
  gk_handling: any;
  gk_kicking: any;
  gk_reflexes: any;
  gk_speed: any;
  gk_positioning: any;
  player_traits: string;
  attacking_crossing: number;
  attacking_finishing: number;
  attacking_heading_accuracy: number;
  attacking_short_passing: number;
  attacking_volleys: number;
  skill_dribbling: number;
  skill_curve: number;
  skill_fk_accuracy: number;
  skill_long_passing: number;
  skill_ball_control: number;
  movement_acceleration: number;
  movement_sprint_speed: number;
  movement_agility: number;
  movement_reactions: number;
  movement_balance: number;
  power_shot_power: number;
  power_jumping: number;
  power_stamina: number;
  power_strength: number;
  power_long_shots: number;
  mentality_aggression: number;
  mentality_interceptions: number;
  mentality_positioning: number;
  mentality_vision: number;
  mentality_penalties: number;
  mentality_composure: number;
  defending_marking: number;
  defending_standing_tackle: number;
  defending_sliding_tackle: number;
  goalkeeping_diving: number;
  goalkeeping_handling: number;
  goalkeeping_kicking: number;
  goalkeeping_positioning: number;
  goalkeeping_reflexes: number;
  ls: string;
  st: string;
  rs: string;
  lw: string;
  lf: string;
  cf: string;
  rf: string;
  rw: string;
  lam: string;
  cam: string;
  ram: string;
  lm: string;
  lcm: string;
  cm: string;
  rcm: string;
  rm: string;
  lwb: string;
  ldm: string;
  cdm: string;
  rdm: string;
  rwb: string;
  lb: string;
  lcb: string;
  cb: string;
  rcb: string;
  rb: string;
}

export type Records = Array<Record>;
