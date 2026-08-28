export interface CreateDailyCheckInRequest {
  cigarettesSmoked: number;
  note?: string;
}

export interface DailyCheckIn {
  id: number;
  date: string;
  cigarettesSmoked: number;
  note: string | null;
  createdAt: string;
}

export interface DailyCheckInStatistics {
  daysSinceQuit: number;
  smokeFreeDays: number;
  currentStreak: number;
  longestStreak: number;
  totalCheckIns: number;
  cigarettesAvoided: number;
  moneySaved: number;
  averageCigarettesPerDay: number;
}