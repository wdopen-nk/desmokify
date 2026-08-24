import { apiRequest } from "./client";
import {
  CreateQuitPlanRequest,
  QuitPlan,
} from "../types/quitPlan";

export async function createQuitPlan(
  request: CreateQuitPlanRequest
): Promise<QuitPlan> {
  return apiRequest<QuitPlan>("/api/QuitPlans", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function getQuitPlan(): Promise<QuitPlan> {
  return apiRequest<QuitPlan>("/api/QuitPlans", {
    method: "GET",
  });
}

export async function updateQuitPlan(
  request: CreateQuitPlanRequest
): Promise<QuitPlan> {
  return apiRequest<QuitPlan>("/api/QuitPlans", {
    method: "PUT",
    body: JSON.stringify(request),
  });
}