export type Skill =
  | 'orientation' | 'career' | 'excel' | 'spreadsheets' | 'statistics' | 'sql'
  | 'visualization' | 'powerbi' | 'tableau' | 'python' | 'pandas' | 'r'
  | 'business' | 'storytelling' | 'ab-testing' | 'portfolio' | 'interview' | 'git';

export type GameKind =
  | 'query-quest' | 'formula-forge' | 'chart-doctor' | 'clean-sweep'
  | 'guess-correlation' | 'pandas-lab' | 'stakeholder-says';

/** One card of a lesson. `body` supports **bold**, `code`, and blank-line paragraphs. */
export interface LessonCard {
  heading: string;
  body: string;
  /** Optional code / formula example shown in a monospace block. */
  example?: string;
  /** Optional language label for the example (sql, python, excel, text). */
  exampleLang?: 'sql' | 'python' | 'excel' | 'text';
  /** Optional pro tip callout. */
  tip?: string;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  /** index into options */
  answer: number;
  explain: string;
}

export interface Step {
  /** globally unique, e.g. "f5-s2" */
  id: string;
  title: string;
  minutes: number;
  xp: number;
  skills: Skill[];
  lesson: LessonCard[];
  /** Optional mini-game that must be cleared to finish the step. `stage` indexes the game's stage list. */
  game?: { kind: GameKind; stage: number };
  quiz: QuizQuestion[];
}

export interface Floor {
  id: number;          // 1..10
  title: string;
  tagline: string;
  color: string;       // hex accent for the 3D floor
  icon: string;        // single emoji
  outcomes: string[];  // "By the end you can…"
  steps: Step[];
}
