export interface SessionProgression {
    id?: number;
    candidatID: number;
    formationSessionID: number;
    progression: number;
    created_at?: string;
    updated_at?: string;
    courIDs: string;
  }