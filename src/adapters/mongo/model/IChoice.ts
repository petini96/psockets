export interface IChoice {
    id?: string;
    options: { id: number; text: string; votes: number }[];
    totalVotes: number;
  }