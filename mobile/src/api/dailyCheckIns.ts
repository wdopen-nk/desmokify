import { apiRequest } from "./client";

import {
  CreateDailyCheckInRequest,
  DailyCheckIn,
  DailyCheckInStatistics,
} from "../types/dailyCheckIn";

export async function createDailyCheckIn(
  request: CreateDailyCheckInRequest
): Promise<DailyCheckIn> {
  return apiRequest<DailyCheckIn>(
    "/api/DailyCheckIns",
    {
      method: "POST",
      body: JSON.stringify(request),
    }
  );
}

export async function getTodayCheckIn(): Promise<DailyCheckIn> {
  return apiRequest<DailyCheckIn>(
    "/api/DailyCheckIns/today",
    {
      method: "GET",
    }
  );
}

export async function getDailyCheckInStatistics(): Promise<DailyCheckInStatistics> {
  return apiRequest<DailyCheckInStatistics>(
    "/api/DailyCheckIns/statistics",
    {
      method: "GET",
    }
  );
}