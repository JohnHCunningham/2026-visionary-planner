export interface Goal {
  id: string;
  category: 'Business' | 'Health';
  title: string;
  description: string;
  status: 'Planned' | 'In Progress' | 'Achieved';
  targetDate: string;
}

export type ValueTier = 'A' | 'B' | 'C';

export interface Task {
  id: string;
  title: string;
  category: 'Financial' | 'Health' | 'Learning' | 'Personal';
  type: 'Priority' | 'Daily';
  valueTier: ValueTier;
  completed: boolean;
  plannedMinutes: number;
  actualMinutes?: number;
  lastCompletedDate?: string;
}

export interface HealthLogEntry {
  date: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  glucose: number;
  isFasting: boolean;
  oxygen: number;
  weight: number;
  sleepHours: number;
  fastingHours: number;
  notes?: string;
}

export interface StrategicReport {
  timestamp: string;
  horizon: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  executiveSummary: string;
  businessHealthScore: number;
  physicalHealthScore: number;
  primaryBlocker: string;
  tacticalDirectives: string[];
  revenueForecast: string;
}

export interface StrategicPlan {
  visionStatement: string;
  quarterlyRoadmap: {
    Q1: string[];
    Q2: string[];
    Q3: string[];
    Q4: string[];
  };
  revenueFactoryRefinement: string;
  healthOptimizations: string[];
}