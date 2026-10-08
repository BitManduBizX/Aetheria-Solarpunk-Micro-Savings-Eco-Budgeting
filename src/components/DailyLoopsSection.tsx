import React, { useState, useEffect } from 'react';
import {
  Timer,
  Disc,
  Users,
  Check,
  Flag,
  Sparkles,
  RefreshCw,
  ArrowUpRight,
} from 'lucide-react';
import { useAetheria } from '../context/AetheriaContext';

const DAILY_VICES = [
  { id: 'v1', label: 'Single-Use Cup Oat Latte', amount: 6.5, co2Saved: '0.6 kg CO₂e' },
  { id: 'v2', label: 'Peak-Hour Solo Ride-Share', amount: 19.0, co2Saved: '3.4 kg CO₂e' },
  { id: 'v3', label: 'Late-Night Courier Takeout', amount: 28.5, co2Saved: '4.9 kg CO₂e' },
  { id: 'v4', label: 'Impulse Fast-Fashion Tee', amount: 34.0, co2Saved: '7.8 kg CO₂e' },
];

export const DailyLoopsSection: React.FC = () => {
  const {
    state,
    pendingTriageTransactions,
    triageTransaction,
    spinPhantomRoulette,
    contributeToGuild,
  } = useAetheria();

  // 60-Second Blitz Timer State
  const [blitzActive, setBlitzActive] = useState(false);
  const [blitzSeconds, setBlitzSeconds] = useState(60);

  // Phantom Savings Roulette State
  const [selectedVice, setSelectedVice] = useState(DAILY_VICES[0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [lastSpinResult, setLastSpinResult] = useState<{
    savedAmount: number;
    xpEarned: number;
    bonusLabel: string;
  } | null>(null);

  useEffect(() => {
    if (!blitzActive) return;
    if (blitzSeconds <= 0 || pendingTriageTransactions.length === 0) {
      setBlitzActive(false);
      return;
    }
    const timer = setInterval(() => {
      setBlitzSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [blitzActive, blitzSeconds, pendingTriageTransactions.length]);

  const handleStartBlitz = () => {
    setBlitzSeconds(60);
    setBlitzActive(true);
  };

  const handleSpinRoulette = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const nextAngle = wheelRotation + 720 + Math.floor(Math.random() * 360);
    setWheelRotation(nextAngle);

    setTimeout(() => {
      const outcome = spinPhantomRoulette(selectedVice.label, selectedVice.amount);
      setLastSpinResult(outcome);
      setIsSpinning(false);
    }, 650);
  };

  const currentBlitzTx = pendingTriageTransactions[0];

  return (
    <div className="space-y-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1E293B]/10 pb-5">
        <div>
          <p className="text-xs text-[#2D5A27] font-semibold">
            03. Daily Retention Loops & Social Accountability
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#1E293B] mt-1">
            60-Second Morning Blitz, Phantom Roulette & Co-Op Guilds
          </h2>
        </div>
        <div className="text-xs text-[#1E293B]/70 font-mono tabular-nums">
          <span>Pending Triage: {pendingTriageTransactions.length} Receipts</span>
          <span aria-hidden="true" className="mx-2">·</span>
          <span>Active Co-Op Pools: {state.guilds.length}</span>
        </div>
      </div>

      {/* Top 2-Column Grid: 60-Second Morning Blitz + Phantom Savings Roulette */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 6 Cols: Daily 60-Second Blitz */}
        <div className="lg:col-span-6 bg-[#FAF8F3] border border-[#1E293B]/12 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#D97706]">
                <Timer className="w-4 h-4 shrink-0" />
                <span>Daily 60-Second Morning Blitz</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  {pendingTriageTransactions.length} Remaining
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono tabular-nums text-xs font-semibold text-[#1E293B]">
                  00:{blitzSeconds.toString().padStart(2, '0')}
                </span>
                {!blitzActive && pendingTriageTransactions.length > 0 && (
                  <button
                    type="button"
                    onClick={handleStartBlitz}
                    className="px-2.5 py-1 text-xs font-semibold bg-[#D97706] text-white rounded-md hover:bg-[#B45309] transition-colors cursor-pointer"
                  >
                    Start 60s Clock
                  </button>
                )}
              </div>
            </div>

            <h3 className="text-xl font-semibold text-[#1E293B]">
              Rapid 3-Decision Receipt Triage
            </h3>
            <p className="text-sm text-[#1E293B]/75 leading-relaxed">
              Review morning transactions in under 60 seconds. Categorizing all pending receipts unlocks a +120 XP Daily Blitz completion bonus.
            </p>

            {/* Triage Deck Area */}
            <div className="border-t border-b border-[#1E293B]/10 py-5">
              {!currentBlitzTx ? (
                <div className="py-6 text-center space-y-2">
                  <p className="text-base font-semibold text-[#10B981]">
                    All Morning Receipts Triaged! (+120 XP Blitz Bonus Claimed)
                  </p>
                  <p className="text-xs text-[#1E293B]/65">
                    Log a new receipt in the Eco-Ledger anytime to practice rapid carbon triage.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs text-[#1E293B]/60">
                        <span>{currentBlitzTx.category}</span>
                        <span aria-hidden="true" className="mx-1.5">·</span>
                        <span>{currentBlitzTx.date}</span>
                        <span aria-hidden="true" className="mx-1.5">·</span>
                        <span className="font-mono tabular-nums text-[#2D5A27] font-medium">
                          {currentBlitzTx.carbonMassKg.toFixed(1)} kg CO₂e
                        </span>
                      </div>
                      <h4 className="text-lg font-semibold text-[#1E293B] mt-1">
                        {currentBlitzTx.merchant}
                      </h4>
                    </div>
                    <div className="text-right font-mono tabular-nums">
                      <span className="text-lg font-semibold text-[#1E293B]">
                        ${currentBlitzTx.amount.toFixed(2)}
                      </span>
                      <span className="block text-xs text-[#8B5CF6]">
                        +${currentBlitzTx.roundUpAmount.toFixed(2)} round-up
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#1E293B]/75 bg-[#F4F1EA] p-3 rounded-lg">
                    Eco-Audit Note: {currentBlitzTx.ecoSwapSuggestion}
                  </p>

                  {/* 3-Swipe / 3-Button Triage Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => triageTransaction(currentBlitzTx.id, 'VERIFY')}
                      className="px-3 py-2.5 text-xs font-semibold bg-[#2D5A27] hover:bg-[#23471E] text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Keep & Verify (+40 XP)
                    </button>

                    <button
                      type="button"
                      onClick={() => triageTransaction(currentBlitzTx.id, 'SWAP_GOAL')}
                      className="px-3 py-2.5 text-xs font-semibold bg-[#D97706] hover:bg-[#B45309] text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Pledge Eco-Swap (+2 Tokens)
                    </button>

                    <button
                      type="button"
                      onClick={() => triageTransaction(currentBlitzTx.id, 'FLAG_IMPULSE')}
                      className="px-3 py-2.5 text-xs font-semibold border border-[#EF4444]/40 text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      Flag Impulse Risk
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-xs text-[#1E293B]/65 flex items-center justify-between">
            <span>Daily Blitz Streak Multiplier: 1.25x XP</span>
            <span className="font-mono tabular-nums">
              {state.blitzCompletedToday ? 'Status: Completed Today' : 'Status: In Progress'}
            </span>
          </div>
        </div>

        {/* Right 6 Cols: Phantom Savings Roulette */}
        <div className="lg:col-span-6 bg-[#FAF8F3] border border-[#1E293B]/12 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#8B5CF6]">
                <Disc className="w-4 h-4 shrink-0" />
                <span>Phantom Savings Roulette</span>
                <span aria-hidden="true">·</span>
                <span>Habit-Swap Multiplier</span>
              </div>
              <span className="text-xs font-mono tabular-nums text-[#2D5A27] font-semibold">
                Up to 1.5x Yield Match
              </span>
            </div>

            <h3 className="text-xl font-semibold text-[#1E293B]">
              Skip a Daily Vice & Spin to Auto-Invest
            </h3>
            <p className="text-sm text-[#1E293B]/75 leading-relaxed">
              Skipped a $6 coffee or $19 solo ride-share today? Select the skipped habit below and spin the Solarpunk wheel to route that phantom spend into your Eco-Index Vault.
            </p>

            {/* Select Skipped Vice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DAILY_VICES.map((vice) => {
                const isSelected = selectedVice.id === vice.id;
                return (
                  <button
                    key={vice.id}
                    type="button"
                    onClick={() => setSelectedVice(vice)}
                    className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-[#2D5A27] bg-[#2D5A27]/8'
                        : 'border-[#1E293B]/12 bg-white hover:border-[#1E293B]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#1E293B] truncate">
                        {vice.label}
                      </span>
                      <span className="font-mono tabular-nums text-xs font-semibold text-[#2D5A27] shrink-0">
                        ${vice.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#1E293B]/60 mt-0.5">
                      Saves {vice.co2Saved}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Wheel + Spin CTA */}
          <div className="pt-3 border-t border-[#1E293B]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Animated SVG Wheel */}
              <div
                className="w-16 h-16 rounded-full border-4 border-[#2D5A27] flex items-center justify-center bg-[#F4F1EA] shrink-0 transition-transform duration-500 ease-out"
                style={{ transform: `rotate(${wheelRotation}deg)` }}
              >
                <RefreshCw className="w-7 h-7 text-[#D97706]" />
              </div>

              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-[#1E293B]">
                  Selected: {selectedVice.label} (${selectedVice.amount.toFixed(2)})
                </div>
                {lastSpinResult ? (
                  <div className="text-xs text-[#10B981] font-medium">
                    Last Spin: Routed ${lastSpinResult.savedAmount.toFixed(2)} (+
                    {lastSpinResult.xpEarned} XP · {lastSpinResult.bonusLabel})
                  </div>
                ) : (
                  <div className="text-xs text-[#1E293B]/65">
                    Spin to apply 1.0x – 1.5x community yield match
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSpinRoulette}
              disabled={isSpinning}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              {isSpinning ? 'Spinning Wheel...' : `Spin & Route $${selectedVice.amount.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Guild & Co-Op Vaults */}
      <div className="bg-[#FAF8F3] border border-[#1E293B]/12 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E293B]/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2D5A27]">
              <Users className="w-4 h-4" />
              <span>Guild & Co-Op Accountability Vaults</span>
            </div>
            <h3 className="text-xl font-semibold text-[#1E293B] mt-1">
              Shared Micro-Savings Pools & Community Dividends
            </h3>
          </div>
          <span className="text-xs text-[#1E293B]/70 font-mono tabular-nums">
            Your Total Co-Op Stake: $
            {state.guilds.reduce((acc, g) => acc + g.userContributed, 0).toFixed(0)}
          </span>
        </div>

        <div className="divide-y divide-[#1E293B]/10">
          {state.guilds.map((guild) => {
            const pct = Math.min(100, Math.round((guild.currentAmount / guild.targetAmount) * 100));
            return (
              <div
                key={guild.id}
                className="py-4 first:pt-1 last:pb-1 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base font-semibold text-[#1E293B]">
                      {guild.name}
                    </h4>
                    <span className="text-xs text-[#2D5A27] font-medium">
                      · {guild.apyBoostLabel}
                    </span>
                  </div>
                  <p className="text-xs text-[#1E293B]/75">{guild.mission}</p>
                  <div className="text-xs text-[#1E293B]/60 flex flex-wrap items-center gap-2 pt-0.5 font-mono tabular-nums">
                    <span>{guild.membersCount} Stewards</span>
                    <span aria-hidden="true">·</span>
                    <span>{guild.accountabilityTimer}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#1E293B] font-medium">
                      Your Stake: ${guild.userContributed}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
                  <div className="w-full sm:w-48 space-y-1">
                    <div className="flex justify-between text-xs font-mono tabular-nums">
                      <span className="font-semibold text-[#1E293B]">
                        ${guild.currentAmount.toLocaleString()}
                      </span>
                      <span className="text-[#1E293B]/60">
                        / ${guild.targetAmount.toLocaleString()} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#1E293B]/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2D5A27] transition-transform duration-200 origin-left"
                        style={{ transform: `scaleX(${pct / 100})` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => contributeToGuild(guild.id, 15)}
                      className="px-3.5 py-2 text-xs font-semibold bg-[#2D5A27] hover:bg-[#23471E] text-white rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer"
                    >
                      +$15 Stake
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
