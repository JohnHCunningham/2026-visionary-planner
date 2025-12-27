
import { Task, HealthLogEntry } from '../types';

const TASKS_KEY = 'v2026_tasks';
const HEALTH_KEY = 'v2026_health';

const initialTasks: Task[] = [
  { id: 't1', title: 'Q1 Market Intelligence Gathering', category: 'Financial', type: 'Priority', valueTier: 'A', plannedMinutes: 120, actualMinutes: 0, completed: false },
  { id: 't2', title: 'Gemini 3.0 Integration Audit', category: 'Learning', type: 'Daily', valueTier: 'B', plannedMinutes: 45, actualMinutes: 0, completed: false },
];

const initialHealth: HealthLogEntry[] = [
  { date: '2026-01-01', systolic: 120, diastolic: 80, pulse: 72, glucose: 5.2, isFasting: true, oxygen: 98, weight: 185, sleepHours: 8.0, fastingHours: 16 },
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
  },
  clearAll: () => {
    localStorage.removeItem(TASKS_KEY);
    localStorage.removeItem(HEALTH_KEY);
    window.location.reload();
  }
};
