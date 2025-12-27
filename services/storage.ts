
import { Task, HealthLogEntry } from '../types';

const TASKS_KEY = 'v2026_tasks';
const HEALTH_KEY = 'v2026_health';

const initialTasks: Task[] = [
  { id: 't1', title: 'Market Outreach: 20 Personalized Proposals', category: 'Financial', type: 'Priority', valueTier: 'A', plannedMinutes: 120, actualMinutes: 95, completed: true },
  { id: 't2', title: 'AI Learning: Advanced RAG Architecture', category: 'Learning', type: 'Daily', valueTier: 'B', plannedMinutes: 45, actualMinutes: 30, completed: true },
  { id: 't3', title: 'Scrolling / News Consumption', category: 'Personal', type: 'Daily', valueTier: 'C', plannedMinutes: 15, actualMinutes: 45, completed: true },
];

const initialHealth: HealthLogEntry[] = [
  { date: '2025-12-12', systolic: 145, diastolic: 92, pulse: 78, glucose: 7.9, isFasting: true, oxygen: 96, weight: 359.3, sleepHours: 7.0, fastingHours: 16 },
  { date: '2025-12-20', systolic: 118, diastolic: 76, pulse: 65, glucose: 5.4, isFasting: true, oxygen: 98, weight: 358.5, sleepHours: 8.0, fastingHours: 16 },
  { date: '2025-12-22', systolic: 116, diastolic: 74, pulse: 70, glucose: 5.1, oxygen: 99, weight: 358.2, isFasting: true, sleepHours: 7.2, fastingHours: 17 },
];

export const storage = {
  getTasks: (): Task[] => {
    const saved = localStorage.getItem(TASKS_KEY);
    return saved ? JSON.parse(saved) : initialTasks;
  },
  saveTasks: (tasks: Task[]) => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    window.dispatchEvent(new Event('storage-update'));
  },
  getHealth: (): HealthLogEntry[] => {
    const saved = localStorage.getItem(HEALTH_KEY);
    return saved ? JSON.parse(saved) : initialHealth;
  },
  saveHealth: (logs: HealthLogEntry[]) => {
    localStorage.setItem(HEALTH_KEY, JSON.stringify(logs));
    window.dispatchEvent(new Event('storage-update'));
  }
};
