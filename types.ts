
export type Difficulty = 'Easy' | 'Medium' | 'Intense';

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  streak: number;
}

export interface UserInputs {
  syllabus: string;
  examDate: string;
  hoursPerDay: number;
  weakAreas: string;
  difficulty: Difficulty;
}

export interface RoadmapMilestone {
  title: string;
  description: string;
  targetDate: string;
  topics: string[];
}

export interface TimetableSlot {
  time: string;
  activity: string;
  topic?: string;
}

export interface RevisionTask {
  topic: string;
  date: string;
  repetitionStage: number; 
}

export interface StudyPlan {
  roadmap: RoadmapMilestone[];
  dailyTimetable: TimetableSlot[];
  revisionSchedule: RevisionTask[];
  weeklySummary: string;
  motivationalQuote: string;
  recommendedStrategies: string[];
  suggestedCategories: string[];
}

export type ViewState = 'dashboard' | 'planner' | 'plan-view' | 'revision' | 'settings' | 'auth';
