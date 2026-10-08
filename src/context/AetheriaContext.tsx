import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AetheriaState,
  CarbonTier,
  TriageStatus,
  TransactionItem,
  ImpulseVaultItem,
  SubscriptionLeech,
} from '../types/aetheria';

const STORAGE_KEY = 'aetheria_solarpunk_state_2027_v1';

export const INFRASTRUCTURE_TIERS = [
  {
    level: 1,
    name: 'Timber Rainwater Well',
    description: 'Hand-carved cedar cistern collecting morning dew and spare-change round-ups.',
    requiredSavings: 0,
    specimenUnlock: 'Silverleaf Moss',
  },
  {
    level: 2,
    name: 'Heliotropic Solar Trellis',
    description: 'Articulated copper-glass canopy tracking sunlight streaks and powering local sensors.',
    requiredSavings: 1200,
    specimenUnlock: 'Sunlit Monarch Butterfly',
  },
  {
    level: 3,
    name: 'Kinetic Hydro-Turbine Mill',
    description: 'High-efficiency terraced waterwheel converting steady savings velocity into clean yield.',
    requiredSavings: 1850,
    specimenUnlock: 'Bioluminescent River Fern',
  },
  {
    level: 4,
    name: 'Atmospheric Aether Conservatory',
    description: 'Geodesic bio-dome sustaining rare alpine flora and maximum community APY resonance.',
    requiredSavings: 2600,
    specimenUnlock: 'Golden Canopy Heron',
  },
];

const INITIAL_STATE: AetheriaState = {
  monthlyBudget: 2400,
  microSavingsBalance: 1640.5,
  baseApy: 4.5,
  bonusApy: 0.65,
  xp: 2840,
  level: 7,
  sunlightEnergy: 84,
  streakDays: 14,
  lastCheckInDate: '2027-05-14',
  ecosystemLevel: 2,
  greenGuildTokens: 18,
  treesPlanted: 11,
  lootChestCurrent: 11.75,
  lootChestTarget: 15.0,
  unlockedSpecimens: ['Silverleaf Moss', 'Sunlit Monarch Butterfly', 'Terraced Pine Sapling'],
  aiConsentGranted: true,
  blitzCompletedToday: false,
  transactions: [
    {
      id: 'tx-101',
      merchant: 'Sunstone Refill & Bulk Cooperative',
      category: 'Groceries & Pantry',
      amount: 46.2,
      date: 'Today · 08:42',
      carbonMassKg: 1.4,
      carbonTier: CarbonTier.LOW,
      roundUpAmount: 0.8,
      triageStatus: TriageStatus.PENDING,
      ecoSwapSuggestion: 'Zero-packaging refill saved 2.8 kg CO₂e vs standard supermarket plastic.',
      potentialTokenReward: 3,
    },
    {
      id: 'tx-102',
      merchant: 'AeroRush Priority Courier Takeout',
      category: 'Dining & Delivery',
      amount: 34.15,
      date: 'Yesterday · 20:15',
      carbonMassKg: 6.8,
      carbonTier: CarbonTier.HIGH,
      roundUpAmount: 0.85,
      triageStatus: TriageStatus.PENDING,
      ecoSwapSuggestion: 'Batch-cooking or neighborhood walk-up pickup saves $11.50 fees + 5.1 kg CO₂e.',
      potentialTokenReward: 0,
    },
    {
      id: 'tx-103',
      merchant: 'loom & Thistle Vintage Exchange',
      category: 'Apparel & Repair',
      amount: 58.0,
      date: 'Yesterday · 14:10',
      carbonMassKg: 1.9,
      carbonTier: CarbonTier.LOW,
      roundUpAmount: 1.0,
      triageStatus: TriageStatus.PENDING,
      ecoSwapSuggestion: 'Secondhand linen purchase avoided 14.2 kg CO₂e vs virgin fast-fashion.',
      potentialTokenReward: 4,
    },
    {
      id: 'tx-104',
      merchant: 'Metro Solar Transit Pass',
      category: 'Mobility',
      amount: 22.4,
      date: 'May 12 · 09:05',
      carbonMassKg: 0.6,
      carbonTier: CarbonTier.LOW,
      roundUpAmount: 0.6,
      triageStatus: TriageStatus.VERIFIED,
      ecoSwapSuggestion: 'Electric rail commute displaced 8.4 kg tailpipe emissions.',
      potentialTokenReward: 2,
    },
    {
      id: 'tx-105',
      merchant: 'FastTrend Synthetic Flash Sale',
      category: 'Shopping',
      amount: 89.25,
      date: 'May 11 · 22:48',
      carbonMassKg: 18.5,
      carbonTier: CarbonTier.HIGH,
      roundUpAmount: 0.75,
      triageStatus: TriageStatus.FLAGGED,
      ecoSwapSuggestion: 'Route late-night apparel impulses into the 24h Cooldown Vault first.',
      potentialTokenReward: 0,
    },
    {
      id: 'tx-106',
      merchant: 'Botanica Roasters (Reusable Tumbler)',
      category: 'Cafe & Craft',
      amount: 5.25,
      date: 'May 10 · 10:18',
      carbonMassKg: 0.3,
      carbonTier: CarbonTier.LOW,
      roundUpAmount: 0.75,
      triageStatus: TriageStatus.VERIFIED,
      ecoSwapSuggestion: 'Oat milk + personal vessel earned a $0.50 discount and low carbon mass.',
      potentialTokenReward: 1,
    },
  ],
  impulseVault: [
    {
      id: 'imp-1',
      title: 'Titanium Modular Desk Lamp',
      category: 'Home & Studio',
      amount: 128.0,
      createdAt: Date.now() - 1000 * 60 * 60 * 14,
      expiresAt: Date.now() + 1000 * 60 * 60 * 10,
      status: 'COOLDOWN',
      triggerNote: 'Saw late-night creator studio reel; testing if needed after 24h.',
    },
    {
      id: 'imp-2',
      title: 'Limited-Edition Mechanical Keycap Set',
      category: 'Tech & Hobbies',
      amount: 74.0,
      createdAt: Date.now() - 1000 * 60 * 60 * 21,
      expiresAt: Date.now() + 1000 * 60 * 60 * 3,
      status: 'COOLDOWN',
      triggerNote: 'Flash drop countdown FOMO — pausing to evaluate.',
    },
  ],
  subscriptions: [
    {
      id: 'sub-1',
      name: 'NebulaStream 8K Cinema Tier',
      category: 'Entertainment',
      monthlyCost: 24.99,
      lastUsedDaysAgo: 41,
      hpDamage: 35,
      status: 'ACTIVE_LEECH',
    },
    {
      id: 'sub-2',
      name: 'CloudVault Pro 4TB Ghost Archive',
      category: 'Software & Cloud',
      monthlyCost: 18.0,
      lastUsedDaysAgo: 68,
      hpDamage: 25,
      status: 'ACTIVE_LEECH',
    },
    {
      id: 'sub-3',
      name: 'MetroBox Mystery Snack Crate',
      category: 'Recurring Delivery',
      monthlyCost: 39.5,
      lastUsedDaysAgo: 29,
      hpDamage: 40,
      status: 'ACTIVE_LEECH',
    },
    {
      id: 'sub-4',
      name: 'HyperFit Virtual Spin Add-On',
      category: 'Fitness',
      monthlyCost: 14.99,
      lastUsedDaysAgo: 95,
      hpDamage: 20,
      status: 'DEFEATED',
    },
  ],
  guilds: [
    {
      id: 'guild-1',
      name: 'Cascadia Solar Micro-Grid Co-Op',
      mission: 'Shared emergency reserve & community rooftop solar dividend pool.',
      targetAmount: 15000,
      currentAmount: 12480,
      membersCount: 48,
      accountabilityTimer: 'Next check-in · 14h 20m',
      userContributed: 340,
      apyBoostLabel: '+0.40% Co-Op Resonance APY',
    },
    {
      id: 'guild-2',
      name: 'Solstice Zero-Waste Bulk Buying Club',
      mission: 'Collective wholesale pantry purchasing to cut food cost by 28%.',
      targetAmount: 5000,
      currentAmount: 4190,
      membersCount: 26,
      accountabilityTimer: 'Cycle closes · 2d 06h',
      userContributed: 185,
      apyBoostLabel: '+2 Green Tokens / Week',
    },
    {
      id: 'guild-3',
      name: 'Alpine Trailhead & Repair Tool Library',
      mission: 'Neighborhood circular hardware & outdoor gear endowment.',
      targetAmount: 8000,
      currentAmount: 6120,
      membersCount: 34,
      accountabilityTimer: 'Milestone · 4d 11h',
      userContributed: 120,
      apyBoostLabel: '+0.25% Circular Yield',
    },
  ],
};

interface AetheriaContextValue {
  state: AetheriaState;
  monthlySpend: number;
  budgetRemaining: number;
  budgetHealthStatus: 'HEALTHY' | 'WARNING' | 'OVER_BUDGET';
  totalCarbonKg: number;
  carbonPer100Spent: number;
  bossHpPercent: number;
  activeSubDrainMonthly: number;
  defeatedSubSavingsMonthly: number;
  pendingTriageTransactions: TransactionItem[];
  lastActionToast: string | null;
  clearToast: () => void;
  harvestDailySunlight: () => void;
  upgradeInfrastructure: () => void;
  addTransaction: (tx: {
    merchant: string;
    category: string;
    amount: number;
    carbonTier: CarbonTier;
  }) => void;
  triageTransaction: (id: string, action: 'VERIFY' | 'SWAP_GOAL' | 'FLAG_IMPULSE') => void;
  addImpulseItem: (item: {
    title: string;
    category: string;
    amount: number;
    triggerNote: string;
  }) => void;
  resolveImpulseItem: (id: string, resolution: 'SAVE' | 'SPEND') => void;
  strikeSubscriptionBoss: (id: string) => void;
  addSubscriptionLeech: (sub: {
    name: string;
    category: string;
    monthlyCost: number;
    lastUsedDaysAgo: number;
  }) => void;
  triggerRoundUpBoost: (amount: number) => void;
  unlockLootChest: () => { rewardTitle: string; rewardDetail: string } | null;
  redeemTreePlanting: () => boolean;
  spinPhantomRoulette: (viceTitle: string, baseAmount: number) => {
    savedAmount: number;
    xpEarned: number;
    bonusLabel: string;
  };
  contributeToGuild: (guildId: string, amount: number) => void;
  setAiConsent: (granted: boolean) => void;
  updateMonthlyBudget: (newBudget: number) => void;
  resetDemoData: () => void;
}

const AetheriaContext = createContext<AetheriaContextValue | undefined>(undefined);

export const AetheriaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AetheriaState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...INITIAL_STATE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Could not read localStorage state, booting clean initial state:', e);
    }
    return INITIAL_STATE;
  });

  const [lastActionToast, setLastActionToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not persist state to localStorage:', e);
    }
  }, [state]);

  const showToast = (msg: string) => {
    setLastActionToast(msg);
  };

  const clearToast = () => setLastActionToast(null);

  const monthlySpend = state.transactions.reduce((acc, tx) => acc + tx.amount, 0) + 985.0; // Base fixed essentials + logged variable receipts
  const budgetRemaining = Math.max(0, state.monthlyBudget - monthlySpend);
  const spendRatio = monthlySpend / Math.max(1, state.monthlyBudget);

  const budgetHealthStatus: 'HEALTHY' | 'WARNING' | 'OVER_BUDGET' =
    spendRatio <= 0.78 ? 'HEALTHY' : spendRatio <= 0.96 ? 'WARNING' : 'OVER_BUDGET';

  const totalCarbonKg = Number(
    state.transactions.reduce((acc, tx) => acc + tx.carbonMassKg, 0).toFixed(1)
  );
  const variableSpend = Math.max(
    1,
    state.transactions.reduce((acc, tx) => acc + tx.amount, 0)
  );
  const carbonPer100Spent = Number(((totalCarbonKg / variableSpend) * 100).toFixed(1));

  const activeSubs = state.subscriptions.filter((s) => s.status === 'ACTIVE_LEECH');
  const defeatedSubs = state.subscriptions.filter((s) => s.status === 'DEFEATED');
  const totalBossMaxHp = state.subscriptions.reduce((acc, s) => acc + s.hpDamage, 0) || 100;
  const currentBossHp = activeSubs.reduce((acc, s) => acc + s.hpDamage, 0);
  const bossHpPercent = Math.round((currentBossHp / totalBossMaxHp) * 100);

  const activeSubDrainMonthly = Number(
    activeSubs.reduce((acc, s) => acc + s.monthlyCost, 0).toFixed(2)
  );
  const defeatedSubSavingsMonthly = Number(
    defeatedSubs.reduce((acc, s) => acc + s.monthlyCost, 0).toFixed(2)
  );

  const pendingTriageTransactions = state.transactions.filter(
    (t) => t.triageStatus === TriageStatus.PENDING
  );

  const computeLevel = (xp: number) => Math.floor(xp / 400) + 1;

  const harvestDailySunlight = () => {
    setState((prev) => {
      const nextXp = prev.xp + 95;
      const nextSunlight = Math.min(100, prev.sunlightEnergy + 16);
      return {
        ...prev,
        sunlightEnergy: nextSunlight,
        streakDays: prev.streakDays + 1,
        xp: nextXp,
        level: computeLevel(nextXp),
        greenGuildTokens: prev.greenGuildTokens + 2,
      };
    });
    showToast('Harvested Daily Sunlight: +16% Canopy Energy, +95 XP, and +2 Green Guild Tokens.');
  };

  const upgradeInfrastructure = () => {
    const nextTier = INFRASTRUCTURE_TIERS.find((t) => t.level === state.ecosystemLevel + 1);
    if (!nextTier) {
      showToast('Your Solarpunk Sanctuary has reached the maximum Conservatory tier!');
      return;
    }
    if (state.microSavingsBalance < nextTier.requiredSavings) {
      const shortfall = (nextTier.requiredSavings - state.microSavingsBalance).toFixed(2);
      showToast(
        `Save $${shortfall} more in your Micro-Savings Vault to unlock the ${nextTier.name}.`
      );
      return;
    }

    setState((prev) => {
      const nextXp = prev.xp + 300;
      const nextSpecimens = prev.unlockedSpecimens.includes(nextTier.specimenUnlock)
        ? prev.unlockedSpecimens
        : [...prev.unlockedSpecimens, nextTier.specimenUnlock];
      return {
        ...prev,
        ecosystemLevel: nextTier.level,
        xp: nextXp,
        level: computeLevel(nextXp),
        bonusApy: Number((prev.bonusApy + 0.15).toFixed(2)),
        unlockedSpecimens: nextSpecimens,
      };
    });
    showToast(
      `Upgraded to Level ${nextTier.level}: ${nextTier.name}! Unlocked ${nextTier.specimenUnlock} & +0.15% APY.`
    );
  };

  const addTransaction = (tx: {
    merchant: string;
    category: string;
    amount: number;
    carbonTier: CarbonTier;
  }) => {
    const cleanAmount = Math.max(0.5, Number(tx.amount));
    const ceilDollar = Math.ceil(cleanAmount);
    const rawRoundUp = Number((ceilDollar - cleanAmount).toFixed(2));
    const roundUpAmount = rawRoundUp === 0 ? 1.0 : rawRoundUp;

    const carbonMultiplier =
      tx.carbonTier === CarbonTier.LOW ? 0.04 : tx.carbonTier === CarbonTier.MODERATE ? 0.11 : 0.24;
    const carbonMassKg = Number((cleanAmount * carbonMultiplier).toFixed(1));
    const tokenReward = tx.carbonTier === CarbonTier.LOW ? 2 : tx.carbonTier === CarbonTier.MODERATE ? 1 : 0;

    const newTx: TransactionItem = {
      id: `tx-${Date.now()}`,
      merchant: tx.merchant.trim(),
      category: tx.category.trim(),
      amount: cleanAmount,
      date: 'Just now',
      carbonMassKg,
      carbonTier: tx.carbonTier,
      roundUpAmount,
      triageStatus: TriageStatus.VERIFIED,
      ecoSwapSuggestion:
        tx.carbonTier === CarbonTier.LOW
          ? 'Verified low-carbon merchant. Earned +2 Green Guild Tokens.'
          : tx.carbonTier === CarbonTier.MODERATE
          ? 'Moderate footprint. Pairing with bulk refill next week lowers carbon mass by 45%.'
          : 'High carbon intensity. Consider shifting future purchases to local circular co-ops.',
      potentialTokenReward: tokenReward,
    };

    setState((prev) => {
      const nextXp = prev.xp + 45;
      return {
        ...prev,
        transactions: [newTx, ...prev.transactions],
        microSavingsBalance: Number((prev.microSavingsBalance + roundUpAmount).toFixed(2)),
        lootChestCurrent: Number(
          Math.min(prev.lootChestTarget, prev.lootChestCurrent + roundUpAmount).toFixed(2)
        ),
        greenGuildTokens: prev.greenGuildTokens + tokenReward,
        sunlightEnergy:
          tx.carbonTier === CarbonTier.HIGH
            ? Math.max(20, prev.sunlightEnergy - 4)
            : Math.min(100, prev.sunlightEnergy + 3),
        xp: nextXp,
        level: computeLevel(nextXp),
      };
    });

    showToast(
      `Logged ${tx.merchant} ($${cleanAmount.toFixed(2)}). Auto-rounded +$${roundUpAmount.toFixed(2)} to Loot Chest!`
    );
  };

  const triageTransaction = (
    id: string,
    action: 'VERIFY' | 'SWAP_GOAL' | 'FLAG_IMPULSE'
  ) => {
    const target = state.transactions.find((t) => t.id === id);
    if (!target) return;

    setState((prev) => {
      const updated = prev.transactions.map((t) => {
        if (t.id !== id) return t;
        return {
          ...t,
          triageStatus:
            action === 'FLAG_IMPULSE' ? TriageStatus.FLAGGED : TriageStatus.VERIFIED,
        };
      });
      const remainingPending = updated.filter((t) => t.triageStatus === TriageStatus.PENDING);
      const bonusXp = remainingPending.length === 0 ? 120 : 40;
      const nextXp = prev.xp + bonusXp;

      return {
        ...prev,
        transactions: updated,
        xp: nextXp,
        level: computeLevel(nextXp),
        greenGuildTokens:
          prev.greenGuildTokens + (action === 'SWAP_GOAL' ? 2 : target.potentialTokenReward),
        sunlightEnergy: Math.min(100, prev.sunlightEnergy + 5),
        blitzCompletedToday: remainingPending.length === 0 ? true : prev.blitzCompletedToday,
      };
    });

    if (action === 'VERIFY') {
      showToast(`Verified "${target.merchant}". +40 XP & +5% Sunlight Energy.`);
    } else if (action === 'SWAP_GOAL') {
      showToast(`Committed to Low-Carbon Swap for "${target.merchant}". +2 Green Guild Tokens!`);
    } else {
      showToast(`Flagged "${target.merchant}" for future 24h Impulse Cooldown protection.`);
    }
  };

  const addImpulseItem = (item: {
    title: string;
    category: string;
    amount: number;
    triggerNote: string;
  }) => {
    const newItem: ImpulseVaultItem = {
      id: `imp-${Date.now()}`,
      title: item.title.trim(),
      category: item.category.trim(),
      amount: Math.max(1, Number(item.amount)),
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24,
      status: 'COOLDOWN',
      triggerNote: item.triggerNote.trim() || '24-hour mindfulness cooldown initiated.',
    };

    setState((prev) => {
      const nextXp = prev.xp + 60;
      return {
        ...prev,
        impulseVault: [newItem, ...prev.impulseVault],
        xp: nextXp,
        level: computeLevel(nextXp),
      };
    });

    showToast(
      `Locked "${newItem.title}" ($${newItem.amount.toFixed(2)}) into the 24-Hour Cooldown Vault. +60 XP!`
    );
  };

  const resolveImpulseItem = (id: string, resolution: 'SAVE' | 'SPEND') => {
    const item = state.impulseVault.find((i) => i.id === id);
    if (!item || item.status !== 'COOLDOWN') return;

    if (resolution === 'SAVE') {
      setState((prev) => {
        const nextXp = prev.xp + 150;
        return {
          ...prev,
          impulseVault: prev.impulseVault.map((i) =>
            i.id === id ? { ...i, status: 'ROUTED_TO_SAVINGS' } : i
          ),
          microSavingsBalance: Number((prev.microSavingsBalance + item.amount).toFixed(2)),
          sunlightEnergy: Math.min(100, prev.sunlightEnergy + 12),
          greenGuildTokens: prev.greenGuildTokens + 3,
          xp: nextXp,
          level: computeLevel(nextXp),
        };
      });
      showToast(
        `Skipped "${item.title}"! Routed $${item.amount.toFixed(2)} to Micro-Savings + 150 XP + 3 Green Tokens.`
      );
    } else {
      setState((prev) => ({
        ...prev,
        impulseVault: prev.impulseVault.map((i) =>
          i.id === id ? { ...i, status: 'SPENT' } : i
        ),
        transactions: [
          {
            id: `tx-imp-${Date.now()}`,
            merchant: item.title,
            category: item.category,
            amount: item.amount,
            date: 'Just now',
            carbonMassKg: Number((item.amount * 0.14).toFixed(1)),
            carbonTier: CarbonTier.MODERATE,
            roundUpAmount: 0.5,
            triageStatus: TriageStatus.VERIFIED,
            ecoSwapSuggestion: 'Released from 24h Cooldown Vault.',
            potentialTokenReward: 0,
          },
          ...prev.transactions,
        ],
      }));
      showToast(`Released "${item.title}" ($${item.amount.toFixed(2)}) and logged to Eco-Ledger.`);
    }
  };

  const strikeSubscriptionBoss = (id: string) => {
    const sub = state.subscriptions.find((s) => s.id === id);
    if (!sub || sub.status === 'DEFEATED') return;

    setState((prev) => {
      const nextXp = prev.xp + 220;
      return {
        ...prev,
        subscriptions: prev.subscriptions.map((s) =>
          s.id === id ? { ...s, status: 'DEFEATED' } : s
        ),
        microSavingsBalance: Number((prev.microSavingsBalance + sub.monthlyCost).toFixed(2)),
        lootChestCurrent: Number(
          Math.min(prev.lootChestTarget, prev.lootChestCurrent + 2.5).toFixed(2)
        ),
        sunlightEnergy: Math.min(100, prev.sunlightEnergy + 10),
        xp: nextXp,
        level: computeLevel(nextXp),
      };
    });

    showToast(
      `CRITICAL HIT! Canceled "${sub.name}" & diverted $${sub.monthlyCost.toFixed(2)}/mo into Micro-Savings (+220 XP).`
    );
  };

  const addSubscriptionLeech = (sub: {
    name: string;
    category: string;
    monthlyCost: number;
    lastUsedDaysAgo: number;
  }) => {
    const newSub: SubscriptionLeech = {
      id: `sub-${Date.now()}`,
      name: sub.name.trim(),
      category: sub.category.trim(),
      monthlyCost: Math.max(1, Number(sub.monthlyCost)),
      lastUsedDaysAgo: Math.max(1, Number(sub.lastUsedDaysAgo)),
      hpDamage: 25,
      status: 'ACTIVE_LEECH',
    };

    setState((prev) => ({
      ...prev,
      subscriptions: [newSub, ...prev.subscriptions],
    }));
    showToast(`Detected new Subscription Leech: "${newSub.name}" ($${newSub.monthlyCost.toFixed(2)}/mo).`);
  };

  const triggerRoundUpBoost = (amount: number) => {
    setState((prev) => {
      const nextXp = prev.xp + 35;
      return {
        ...prev,
        microSavingsBalance: Number((prev.microSavingsBalance + amount).toFixed(2)),
        lootChestCurrent: Number(
          Math.min(prev.lootChestTarget, prev.lootChestCurrent + amount).toFixed(2)
        ),
        xp: nextXp,
        level: computeLevel(nextXp),
      };
    });
    showToast(`Added $${amount.toFixed(2)} Round-Up Boost toward Weekly Mystery Loot Chest!`);
  };

  const unlockLootChest = () => {
    if (state.lootChestCurrent < state.lootChestTarget) {
      return null;
    }

    const possibleRewards = [
      {
        rewardTitle: '+0.20% Solarpunk Canopy APY Boost',
        rewardDetail: 'Permanent yield boost applied to your Micro-Savings Vault.',
        specimen: 'Crystal Dew Geodesic Lantern',
        apyDelta: 0.2,
      },
      {
        rewardTitle: 'Rare Specimen: Golden Koi Pond & +0.15% APY',
        rewardDetail: 'Unlocked Golden Koi in your floating island waters + 180 XP.',
        specimen: 'Golden Terrarium Koi',
        apyDelta: 0.15,
      },
      {
        rewardTitle: 'Wind-Chime Kinetic Turbine & +4 Green Tokens',
        rewardDetail: 'Boosted island wind harvesting and credited +4 Green Guild Tokens.',
        specimen: 'Brass Wind-Chime Turbine',
        apyDelta: 0.1,
      },
    ];

    const pick = possibleRewards[state.level % possibleRewards.length];

    setState((prev) => {
      const nextXp = prev.xp + 180;
      const nextSpecimens = prev.unlockedSpecimens.includes(pick.specimen)
        ? prev.unlockedSpecimens
        : [...prev.unlockedSpecimens, pick.specimen];
      return {
        ...prev,
        lootChestCurrent: 0,
        bonusApy: Number((prev.bonusApy + pick.apyDelta).toFixed(2)),
        greenGuildTokens: prev.greenGuildTokens + 4,
        unlockedSpecimens: nextSpecimens,
        xp: nextXp,
        level: computeLevel(nextXp),
      };
    });

    showToast(`Loot Chest Unlocked: ${pick.rewardTitle}!`);
    return { rewardTitle: pick.rewardTitle, rewardDetail: pick.rewardDetail };
  };

  const redeemTreePlanting = () => {
    if (state.greenGuildTokens < 5) {
      showToast('Requires 5 Green Guild Tokens to sponsor 1 verified native sapling.');
      return false;
    }
    setState((prev) => {
      const nextXp = prev.xp + 110;
      return {
        ...prev,
        greenGuildTokens: prev.greenGuildTokens - 5,
        treesPlanted: prev.treesPlanted + 1,
        sunlightEnergy: Math.min(100, prev.sunlightEnergy + 8),
        xp: nextXp,
        level: computeLevel(nextXp),
      };
    });
    showToast('Planted 1 verified native sapling in the Cascadia Reforestation Corridor (+110 XP)!');
    return true;
  };

  const spinPhantomRoulette = (viceTitle: string, baseAmount: number) => {
    const outcomes = [
      { mult: 1.0, xp: 75, label: '1.0x Direct Eco-Index Vault Route' },
      { mult: 1.25, xp: 110, label: '1.25x Solarpunk Streak Match (+25% Bonus)' },
      { mult: 1.5, xp: 160, label: '1.5x Golden Sun Jackpot Route' },
      { mult: 1.15, xp: 95, label: '1.15x Canopy Yield Compounding' },
    ];
    const chosen = outcomes[Math.floor(Math.random() * outcomes.length)];
    const savedAmount = Number((baseAmount * chosen.mult).toFixed(2));

    setState((prev) => {
      const nextXp = prev.xp + chosen.xp;
      return {
        ...prev,
        microSavingsBalance: Number((prev.microSavingsBalance + savedAmount).toFixed(2)),
        lootChestCurrent: Number(
          Math.min(prev.lootChestTarget, prev.lootChestCurrent + 1.5).toFixed(2)
        ),
        sunlightEnergy: Math.min(100, prev.sunlightEnergy + 7),
        xp: nextXp,
        level: computeLevel(nextXp),
      };
    });

    showToast(
      `Phantom Roulette (${viceTitle}): Routed $${savedAmount.toFixed(2)} into Savings (${chosen.label})!`
    );

    return {
      savedAmount,
      xpEarned: chosen.xp,
      bonusLabel: chosen.label,
    };
  };

  const contributeToGuild = (guildId: string, amount: number) => {
    setState((prev) => {
      const nextXp = prev.xp + 85;
      return {
        ...prev,
        microSavingsBalance: Number((prev.microSavingsBalance + amount).toFixed(2)),
        guilds: prev.guilds.map((g) =>
          g.id === guildId
            ? {
                ...g,
                currentAmount: g.currentAmount + amount,
                userContributed: g.userContributed + amount,
              }
            : g
        ),
        greenGuildTokens: prev.greenGuildTokens + 2,
        xp: nextXp,
        level: computeLevel(nextXp),
      };
    });
    showToast(`Co-Op Contribution: Added $${amount.toFixed(2)} to Guild Pool (+85 XP & +2 Green Tokens).`);
  };

  const setAiConsent = (granted: boolean) => {
    setState((prev) => ({ ...prev, aiConsentGranted: granted }));
    showToast(
      granted
        ? 'Aetheria AI Context Consent enabled for personalized carbon & subscription audits.'
        : 'Aetheria AI Context Consent paused. Financial metadata stays strictly local.'
    );
  };

  const updateMonthlyBudget = (newBudget: number) => {
    const clean = Math.max(500, Math.min(25000, Number(newBudget) || 2400));
    setState((prev) => ({ ...prev, monthlyBudget: clean }));
    showToast(`Updated monthly budget target to $${clean.toLocaleString()}.`);
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(INITIAL_STATE);
    showToast('Restored Aetheria 2027 default Solarpunk ecosystem state.');
  };

  return (
    <AetheriaContext.Provider
      value={{
        state,
        monthlySpend,
        budgetRemaining,
        budgetHealthStatus,
        totalCarbonKg,
        carbonPer100Spent,
        bossHpPercent,
        activeSubDrainMonthly,
        defeatedSubSavingsMonthly,
        pendingTriageTransactions,
        lastActionToast,
        clearToast,
        harvestDailySunlight,
        upgradeInfrastructure,
        addTransaction,
        triageTransaction,
        addImpulseItem,
        resolveImpulseItem,
        strikeSubscriptionBoss,
        addSubscriptionLeech,
        triggerRoundUpBoost,
        unlockLootChest,
        redeemTreePlanting,
        spinPhantomRoulette,
        contributeToGuild,
        setAiConsent,
        updateMonthlyBudget,
        resetDemoData,
      }}
    >
      {children}
    </AetheriaContext.Provider>
  );
};

export const useAetheria = () => {
  const context = useContext(AetheriaContext);
  if (!context) {
    throw new Error('useAetheria must be used within an AetheriaProvider');
  }
  return context;
};
