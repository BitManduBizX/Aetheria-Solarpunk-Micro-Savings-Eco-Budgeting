export enum CarbonTier {
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
}

export enum TriageStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  FLAGGED = 'FLAGGED',
}

export interface TransactionItem {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  carbonMassKg: number;
  carbonTier: CarbonTier;
  roundUpAmount: number;
  triageStatus: TriageStatus;
  ecoSwapSuggestion: string;
  potentialTokenReward: number;
}

export interface ImpulseVaultItem {
  id: string;
  title: string;
  category: string;
  amount: number;
  createdAt: number;
  expiresAt: number;
  status: 'COOLDOWN' | 'ROUTED_TO_SAVINGS' | 'SPENT';
  triggerNote: string;
}

export interface SubscriptionLeech {
  id: string;
  name: string;
  category: string;
  monthlyCost: number;
  lastUsedDaysAgo: number;
  hpDamage: number;
  status: 'ACTIVE_LEECH' | 'DEFEATED';
}

export interface GuildPool {
  id: string;
  name: string;
  mission: string;
  targetAmount: number;
  currentAmount: number;
  membersCount: number;
  accountabilityTimer: string;
  userContributed: number;
  apyBoostLabel: string;
}

export interface AiInsightResponse {
  headline: string;
  summary: string;
  actionItems: string[];
  suggestedFeature: string;
  sourceMode?: string;
}

export interface AetheriaState {
  monthlyBudget: number;
  microSavingsBalance: number;
  baseApy: number;
  bonusApy: number;
  xp: number;
  level: number;
  sunlightEnergy: number;
  streakDays: number;
  lastCheckInDate: string;
  ecosystemLevel: number;
  greenGuildTokens: number;
  treesPlanted: number;
  lootChestCurrent: number;
  lootChestTarget: number;
  unlockedSpecimens: string[];
  aiConsentGranted: boolean;
  blitzCompletedToday: boolean;
  transactions: TransactionItem[];
  impulseVault: ImpulseVaultItem[];
  subscriptions: SubscriptionLeech[];
  guilds: GuildPool[];
}
