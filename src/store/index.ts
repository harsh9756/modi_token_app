import { ReferralType } from "@/types/ReferralType";
import {
  BoosterType,
  BoosterTypes,
  DailyBoosterType,
  Level,
} from "@/types/UserType";
import { create } from "zustand";

type StoreStateType = {
  boosters: Record<BoosterTypes, BoosterType>;
  totalDailyRewards: number;
  dailyResetEnergy: DailyBoosterType;
  maxDailyResetEnergy: number;
  passive_earning: number;
  maxLevel: number;
  levels: Level[];
  levelUp: {
    max_energy: number;
    earn_per_tap: number;
  };
  referral: ReferralType;
  totalReferals: number;
  setDailyResetEnergy: (update: (prev: DailyBoosterType) => DailyBoosterType) => void;
};

export const useStore = create<StoreStateType>((set) => ({
  boosters: {
    energy_limit: { level: 0, cost: 0, increase_by: 0 },
    multi_tap: { level: 0, cost: 0, increase_by: 0 },
    full_energy: { level: 0, cost: 0, increase_by: 0 },
  },
  totalDailyRewards: 0,
  passive_earning: 0,
  dailyResetEnergy: { uses_today: 0, next_available_at: null },
  maxDailyResetEnergy: 6,
  maxLevel: 18,
  levels: [],
  levelUp: {
    max_energy: 500,
    earn_per_tap: 0.001,
  },
  totalReferals: 0,
  referral: {
    base: {
      welcome: 0,
      levelUp: {},
    },
    premium: {
      welcome: 0,
      levelUp: {},
    },
  },
  setDailyResetEnergy: (update) => set((state) => ({
    dailyResetEnergy: update(state.dailyResetEnergy),
  })),
}));
