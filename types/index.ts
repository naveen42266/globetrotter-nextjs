// types/index.ts

// types/index.ts
export interface Destination {
  id: string;
  name: string;
  clues: string[];
  funFacts: string[];
  trivia: string;
}
  
  export interface GameData {
    clues: string[];
    options: {
      id: string;
      name: string;
    }[];
    correctId: string;
  }
  
  export interface UserScore {
    correct: number;
    incorrect: number;
  }
  
  export interface User {
    username: string;
    score: UserScore;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
  }
  
  export type GameResult = 'correct' | 'incorrect' | null;