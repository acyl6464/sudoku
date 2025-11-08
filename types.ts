
export interface Cell {
  value: number | null;
  notes: Set<number>;
  isGiven: boolean;
  isError: boolean;
}

export type Grid = Cell[][];

export enum Difficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
  Expert = "Expert",
  Master = "Master",
  Extreme = "Extreme",
}

export enum Mode {
    Classic = "Classic",
    Killer = "Killer",
}
