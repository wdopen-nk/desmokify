export interface CreateQuitPlanRequest {
    quitDate: string;
    cigarettesPerDay: number;
    cigarettesPerPack: number;
    packPrice: number;
}


export interface QuitPlan {
  id: number;
  quitDate: string;
  cigarettesPerDay: number;
  cigarettesPerPack: number;
  packPrice: number;
  createdAt: string;
}