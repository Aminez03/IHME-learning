export interface Feedback {
  id?: number;
    texte: string;
    created_at?: Date;
    candidatID: number; // Clé étrangère
    formationSessionID: number; // Clé étrangère
    avatarUrl?: string; // Add avatarUrl property
    nom?: string; // Add avatarUrl property
    isEditing?: boolean;
  }
  