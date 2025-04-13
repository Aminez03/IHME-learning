
  export interface Certificat {
    id?: number; // Optionnel pour les nouveaux certificats
    dateObtention: string; // Format date ISO (ex: "2024-03-28")
    note: number; // Format décimal
    statut: string; // Ex: "Validé", "En attente", etc.
    courIDs: string;
  }
  