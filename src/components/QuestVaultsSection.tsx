import React, { useState } from 'react';
import {
  Clock,
  Swords,
  Gift,
  Plus,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sparkles,
} from 'lucide-react';
import { useAetheria } from '../context/AetheriaContext';
import leechBossUrl from '../assets/images/leech_boss_siphon_1791438842531.jpg';

export const QuestVaultsSection: React.FC = () => {
  const {
    state,
    bossHpPercent,
    activeSubDrainMonthly,
    defeatedSubSavingsMonthly,
    addImpulseItem,
    resolveImpulseItem,
    strikeSubscriptionBoss,
    addSubscriptionLeech,
    triggerRoundUpBoost,
    unlockLootChest,
  } = useAetheria();

  // Impulse Delay Vault form state
  const [impulseTitle, setImpulseTitle] = useState('');
  const [impulseAmount, setImpulseAmount] = useState('');
  const [impulseCategory, setImpulseCategory] = useState('Tech & Gadgets');
  const [impulseNote, setImpulseNote] = useState('');

  // Add Subscription Leech form state
  const [showSubForm, setShowSubForm] = useState(false);
  const [subName, setSubName] = useState('');
  const [subCost, setSubCost] = useState('');
  const [subDays, setSubDays] = useState('35');

  // Loot Chest Reward banner
  const [unboxedReward, setUnboxedReward] = useState<{
    rewardTitle: string;
    rewardDetail: string;
  } | null>(null);
  const [bossImgError, setBossImgError] = useState(false);

  const handleLockImpulse = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(impulseAmount);
    if (!impulseTitle.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;
    addImpulseItem({
      title: impulseTitle,
      category: impulseCategory,
      amount: parsedAmount,
      triggerNote: impulseNote,
    });
    setImpulseTitle('');
    setImpulseAmount('');
    setImpulseNote('');
  };

  const handleAddLeech = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedCost = parseFloat(subCost);
    if (!subName.trim() || isNaN(parsedCost) || parsedCost <= 0) return;
    addSubscriptionLeech({
      name: subName,
      category: 'Recurring Audit',
      monthlyCost: parsedCost,
      lastUsedDaysAgo: parseInt(subDays, 10) || 30,
    });
    setSubName('');
    setSubCost('');
    setShowSubForm(false);
  };

  const handleOpenChest = () => {
    const res = unlockLootChest();
    if (res) {
      setUnboxedReward(res);
    }
  };

  const formatRemainingHours = (expiresAt: number) => {
    const diffMs = Math.max(0, expiresAt - Date.now());
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m cooldown left`;
  };

  const activeCooldowns = state.impulseVault.filter((i) => i.status === 'COOLDOWN');
  const savedImpulses = state.impulseVault.filter((i) => i.status === 'ROUTED_TO_SAVINGS');

  return (
    <div className="space-y-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1E293B]/10 pb-5">
        <div>
          <p className="text-xs text-[#2D5A27] font-semibold">
            01. Dynamic Micro-Savings & Quest Vaults
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#1E293B] mt-1">
            Impulse Cooldown, Subscription Bosses & Spare-Change Loot
          </h2>
        </div>
        <div className="text-xs text-[#1E293B]/70 font-mono tabular-nums">
          <span>Vault Balance: ${state.microSavingsBalance.toFixed(2)}</span>
          <span aria-hidden="true" className="mx-2">·</span>
          <span>Effective Yield: {(state.baseApy + state.bonusApy).toFixed(2)}% APY</span>
        </div>
      </div>

      {/* Main 2-Column Grid: Impulse Delay Vault + Subscription Boss Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Column 1 (6 cols): The 24-Hour Impulse Delay Vault */}
        <div className="lg:col-span-6 bg-[#FAF8F3] border border-[#1E293B]/12 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#F59E0B] font-semibold">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>24-Hour Impulse Delay Vault</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{activeCooldowns.length} Active Timers</span>
                </div>
                <h3 className="text-xl font-semibold text-[#1E293B] mt-1">
                  Pause FOMO Purchases & Route Capital to Yield
                </h3>
              </div>
            </div>

            <p className="text-sm text-[#1E293B]/75 leading-relaxed">
              Deposit tempted non-essential buys into a 24-hour cooling chamber. Skipping the purchase routes 100% of the capital into your Solarpunk Vault and awards +150 XP.
            </p>

            {/* Active Impulse Cooldown Items List (Dividers instead of nested cards) */}
            <div className="divide-y divide-[#1E293B]/10 border-t border-b border-[#1E293B]/10">
              {activeCooldowns.length === 0 ? (
                <div className="py-6 text-center space-y-1">
                  <p className="text-sm font-medium text-[#1E293B]">
                    Zero active impulse temptations in cooldown.
                  </p>
                  <p className="text-xs text-[#1E293B]/65">
                    Log a tempted purchase below whenever an online flash sale strikes.
                  </p>
                </div>
              ) : (
                activeCooldowns.map((item) => (
                  <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#1E293B]">
                          {item.title}
                        </span>
                        <span className="font-mono tabular-nums text-sm font-semibold text-[#D97706]">
                          ${item.amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-xs text-[#1E293B]/65 flex flex-wrap items-center gap-1.5">
                        <span>{item.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#F59E0B] font-medium tabular-nums">
                          {formatRemainingHours(item.expiresAt)}
                        </span>
                      </div>
                      <p className="text-xs text-[#1E293B]/70 italic">
                        “{item.triggerNote}”
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => resolveImpulseItem(item.id, 'SAVE')}
                        className="px-3.5 py-2 text-xs font-semibold bg-[#2D5A27] hover:bg-[#23471E] text-white rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Skip & Save (+150 XP)
                      </button>
                      <button
                        type="button"
                        onClick={() => resolveImpulseItem(item.id, 'SPEND')}
                        className="px-3 py-2 text-xs font-medium text-[#1E293B]/70 hover:text-[#1E293B] border border-[#1E293B]/15 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Release
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {savedImpulses.length > 0 && (
              <div className="text-xs text-[#10B981] font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Skipped {savedImpulses.length} impulse item(s) this month · Saved $
                  {savedImpulses.reduce((acc, i) => acc + i.amount, 0).toFixed(2)} into canopy yield.
                </span>
              </div>
            )}
          </div>

          {/* Lock New Impulse Form */}
          <form onSubmit={handleLockImpulse} className="pt-2 space-y-3">
            <p className="text-xs font-semibold text-[#1E293B]">
              Lock a Tempted Purchase in 24h Cooldown
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <input
                type="text"
                required
                placeholder="Item name (e.g., Espresso Grinder)"
                value={impulseTitle}
                onChange={(e) => setImpulseTitle(e.target.value)}
                className="sm:col-span-5 px-3 py-2 text-xs bg-white border border-[#1E293B]/15 rounded-lg focus:outline-none focus:border-[#2D5A27]"
              />
              <input
                type="number"
                step="0.01"
                min="1"
                required
                placeholder="Cost ($)"
                value={impulseAmount}
                onChange={(e) => setImpulseAmount(e.target.value)}
                className="sm:col-span-3 px-3 py-2 text-xs font-mono bg-white border border-[#1E293B]/15 rounded-lg focus:outline-none focus:border-[#2D5A27]"
              />
              <select
                value={impulseCategory}
                onChange={(e) => setImpulseCategory(e.target.value)}
                className="sm:col-span-4 px-2.5 py-2 text-xs bg-white border border-[#1E293B]/15 rounded-lg focus:outline-none focus:border-[#2D5A27]"
              >
                <option value="Tech & Gadgets">Tech & Gadgets</option>
                <option value="Apparel & Drop">Apparel & Drop</option>
                <option value="Home Decor">Home Decor</option>
                <option value="Dining & Treat">Dining & Treat</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <input
                type="text"
                placeholder="Why did this catch your eye? (Optional mindfulness note)"
                value={impulseNote}
                onChange={(e) => setImpulseNote(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-white border border-[#1E293B]/15 rounded-lg focus:outline-none focus:border-[#2D5A27]"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-[#D97706] hover:bg-[#B45309] text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Start 24h Timer
              </button>
            </div>
          </form>
        </div>

        {/* Column 2 (6 cols): Subscription Boss Battles ("Leech Monsters") */}
        <div className="lg:col-span-6 bg-[#FAF8F3] border border-[#1E293B]/12 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Boss Encounter Header with Artwork */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4 border-b border-[#1E293B]/10">
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#1E293B]/15 shrink-0 bg-[#1E293B] flex items-center justify-center">
                {!bossImgError ? (
                  <img
                    src={leechBossUrl}
                    alt="The Recurring Siphon Parasite Boss"
                    referrerPolicy="no-referrer"
                    onError={() => setBossImgError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Swords className="w-8 h-8 text-[#EF4444]" />
                )}
              </div>

              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-[#EF4444] flex items-center gap-1.5">
                    <Swords className="w-3.5 h-3.5" />
                    Subscription Boss Arena
                  </span>
                  <span className="font-mono tabular-nums font-semibold text-[#1E293B]">
                    Boss HP: {bossHpPercent}%
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-[#1E293B]">
                  The Recurring Siphon Leech
                </h3>

                {/* Boss Health Bar */}
                <div className="w-full h-2.5 bg-[#1E293B]/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#EF4444] transition-transform duration-200 origin-left"
                    style={{ transform: `scaleX(${bossHpPercent / 100})` }}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#1E293B]/70 font-mono tabular-nums pt-0.5">
                  <span>Active Drain: ${activeSubDrainMonthly.toFixed(2)}/mo</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#10B981] font-medium">
                    Diverted to Yield: ${defeatedSubSavingsMonthly.toFixed(2)}/mo
                  </span>
                </div>
              </div>
            </div>

            {/* Subscription Leeches Roster */}
            <div className="divide-y divide-[#1E293B]/10">
              {state.subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold ${
                          sub.status === 'DEFEATED'
                            ? 'line-through text-[#1E293B]/45'
                            : 'text-[#1E293B]'
                        }`}
                      >
                        {sub.name}
                      </span>
                      <span className="font-mono tabular-nums text-sm font-semibold text-[#EF4444]">
                        ${sub.monthlyCost.toFixed(2)}/mo
                      </span>
                    </div>
                    <div className="text-xs text-[#1E293B]/65 mt-0.5">
                      <span>{sub.category}</span>
                      <span aria-hidden="true" className="mx-1.5">·</span>
                      <span className="tabular-nums">
                        Last used {sub.lastUsedDaysAgo} days ago
                      </span>
                      <span aria-hidden="true" className="mx-1.5">·</span>
                      <span className="tabular-nums">
                        ${(sub.monthlyCost * 12).toFixed(0)}/yr impact
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {sub.status === 'ACTIVE_LEECH' ? (
                      <button
                        type="button"
                        onClick={() => strikeSubscriptionBoss(sub.id)}
                        className="px-3.5 py-2 text-xs font-semibold bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        Strike Critical Hit (Cancel)
                      </button>
                    ) : (
                      <span className="text-xs font-medium text-[#10B981] flex items-center gap-1 whitespace-nowrap">
                        <ShieldCheck className="w-4 h-4" />
                        Defeated & Diverted
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Custom Subscription Audit */}
          <div className="pt-2 border-t border-[#1E293B]/10">
            {!showSubForm ? (
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#1E293B]/70">
                  Spotted another recurring charge on your statement?
                </span>
                <button
                  type="button"
                  onClick={() => setShowSubForm(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-[#2D5A27] hover:bg-[#2D5A27]/10 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  + Audit Subscription
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddLeech} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Service name"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  className="sm:col-span-5 px-3 py-1.5 text-xs bg-white border border-[#1E293B]/15 rounded-lg"
                />
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  placeholder="$/mo"
                  value={subCost}
                  onChange={(e) => setSubCost(e.target.value)}
                  className="sm:col-span-3 px-3 py-1.5 text-xs font-mono bg-white border border-[#1E293B]/15 rounded-lg"
                />
                <input
                  type="number"
                  min="1"
                  placeholder="Days idle"
                  value={subDays}
                  onChange={(e) => setSubDays(e.target.value)}
                  className="sm:col-span-2 px-2.5 py-1.5 text-xs font-mono bg-white border border-[#1E293B]/15 rounded-lg"
                />
                <button
                  type="submit"
                  className="sm:col-span-2 px-3 py-1.5 text-xs font-semibold bg-[#1E293B] text-white rounded-lg whitespace-nowrap cursor-pointer"
                >
                  Add
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Full-Width Strip: Rounding-Up Quests & Weekly Mystery Loot Chest */}
      <div className="bg-[#FAF8F3] border border-[#1E293B]/12 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8B5CF6]">
              <Gift className="w-4 h-4 shrink-0" />
              <span>Weekly Spare-Change Rounding Quest</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                ${state.lootChestCurrent.toFixed(2)} / ${state.lootChestTarget.toFixed(2)} Filled
              </span>
            </div>
            <h3 className="text-xl font-semibold text-[#1E293B]">
              Mystery Botanical Loot Chest & APY Resonance
            </h3>
            <p className="text-sm text-[#1E293B]/75">
              Every logged transaction rounds up to the nearest dollar. Fill the $15.00 weekly chest to unlock permanent Eco-APY boosts and rare wildlife for your floating island.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="w-full sm:w-48 space-y-1.5">
              <div className="flex justify-between text-xs font-mono tabular-nums text-[#1E293B]/80">
                <span>Chest Charge</span>
                <span>
                  {Math.min(100, Math.round((state.lootChestCurrent / state.lootChestTarget) * 100))}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#1E293B]/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#8B5CF6] transition-transform duration-200 origin-left"
                  style={{
                    transform: `scaleX(${Math.min(1, state.lootChestCurrent / state.lootChestTarget)})`,
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => triggerRoundUpBoost(1.75)}
              className="px-4 py-2.5 text-xs font-semibold border border-[#1E293B]/20 text-[#1E293B] hover:bg-[#1E293B]/5 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              +$1.75 Spare Round-Up
            </button>

            <button
              type="button"
              disabled={state.lootChestCurrent < state.lootChestTarget}
              onClick={handleOpenChest}
              className={`px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
                state.lootChestCurrent >= state.lootChestTarget
                  ? 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white cursor-pointer'
                  : 'bg-[#1E293B]/10 text-[#1E293B]/45 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {state.lootChestCurrent >= state.lootChestTarget
                ? 'Unlock Mystery Chest!'
                : `Need $${(state.lootChestTarget - state.lootChestCurrent).toFixed(2)} More`}
            </button>
          </div>
        </div>

        {unboxedReward && (
          <div className="mt-4 pt-4 border-t border-[#8B5CF6]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="text-[#8B5CF6] font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Unboxed: {unboxedReward.rewardTitle}</span>
              <span aria-hidden="true">·</span>
              <span className="font-normal text-[#1E293B]/80">{unboxedReward.rewardDetail}</span>
            </div>
            <button
              type="button"
              onClick={() => setUnboxedReward(null)}
              className="text-xs text-[#1E293B]/60 hover:text-[#1E293B] self-end sm:self-auto"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
