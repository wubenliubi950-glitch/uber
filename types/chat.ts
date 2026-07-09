export type Role = "user" | "assistant";

export interface ChatMessage {
  role: Role;
  content: string;
}

export type Level = "beginner" | "intermediate";

/** Topic keys the tutor can focus the conversation on. */
export type Topic =
  | "daily"
  | "travel"
  | "university"
  | "architecture"
  | "lab"
  | "presentation"
  | "study_abroad"
  | "interview";

export interface TutorSettings {
  level: Level;
  topic: Topic;
  /** Read the tutor's English reply aloud automatically. */
  autoSpeak: boolean;
}

/** Parsed feedback block from a tutor turn. */
export interface Feedback {
  good?: string;
  fix?: string;
  natural?: string;
  next?: string;
}
