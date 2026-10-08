import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Send,
  Minimize2,
  Maximize2,
  Lock,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { useAetheria } from '../context/AetheriaContext';
import { AiInsightResponse } from '../types/aetheria';

export const AetheriaAiWidget: React.FC = () => {
  const {
    state,
    monthlySpend,
    budgetRemaining,
    budgetHealthStatus,
    carbonPer100Spent,
    bossHpPercent,
    activeSubDrainMonthly,
    setAiConsent,
  } = useAetheria();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [insight, setInsight] = useState<AiInsightResponse>({
    headline: `Day ${state.streakDays} Canopy Pulse · $${budgetRemaining.toFixed(0)} Buffer`,
    summary: `Your floating island is at Tier ${state.ecosystemLevel} with ${state.sunlightEnergy}% Sunlight. Defeating your remaining ${
      state.subscriptions.filter((s) => s.status === 'ACTIVE_LEECH').length
    } subscription leeches will free up $${activeSubDrainMonthly.toFixed(2)}/mo for your ${(
      state.baseApy + state.bonusApy
    ).toFixed(2)}% APY vault.`,
    actionItems: [
      'Strike a critical hit on NebulaStream ($24.99/mo) in the Subscription Boss Arena.',
      'Skip one tempted item in your 24h Impulse Cooldown Vault to claim +150 XP.',
      'Redeem 5 Green Guild Tokens to sponsor a verified native Douglas Fir sapling.',
    ],
    suggestedFeature: 'Subscription Boss Arena & 24h Cooldown Vault',
  });

  const runAiRequest = async (mode: 'chat' | 'audit', customPrompt?: string) => {
    if (!state.aiConsentGranted) {
      setErrorMsg('Please enable Privacy Context Consent below before requesting an AI audit.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          prompt: customPrompt || query,
          consentGranted: state.aiConsentGranted,
          context: {
            monthlyBudget: state.monthlyBudget,
            monthlySpend: Number(monthlySpend.toFixed(2)),
            budgetHealthStatus,
            microSavingsBalance: state.microSavingsBalance,
            effectiveApy: Number((state.baseApy + state.bonusApy).toFixed(2)),
            streakDays: state.streakDays,
            sunlightEnergy: state.sunlightEnergy,
            ecosystemLevel: state.ecosystemLevel,
            bossHp: bossHpPercent,
            activeSubCount: state.subscriptions.filter((s) => s.status === 'ACTIVE_LEECH').length,
            activeSubDrainMonthly,
            carbonPer100: carbonPer100Spent,
            greenGuildTokens: state.greenGuildTokens,
            activeImpulseCooldowns: state.impulseVault.filter((i) => i.status === 'COOLDOWN')
              .length,
          },
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Could not reach Aetheria AI service.');
      }

      const data: AiInsightResponse = await response.json();
      setInsight(data);
      if (customPrompt !== undefined || mode === 'chat') {
        setQuery('');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Temporary connection issue.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    runAiRequest('chat', query.trim());
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-4 py-3 bg-[#2D5A27] hover:bg-[#23471E] text-white rounded-full shadow-lg border border-white/15 flex items-center gap-2.5 text-xs font-semibold transition-transform hover:scale-[1.02] cursor-pointer whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4 text-[#F59E0B]" />
          <span>Aetheria AI Steward</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums text-emerald-200">
            Lvl {state.level}
          </span>
          <Maximize2 className="w-3.5 h-3.5 ml-1 opacity-80" />
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Aetheria AI Steward Assistant"
      className="fixed bottom-5 right-5 z-40 w-[calc(100vw-2.5rem)] sm:w-[410px] bg-[#FAF8F3] border border-[#1E293B]/20 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[82vh]"
    >
      {/* Header */}
      <div className="bg-[#2D5A27] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#F59E0B] shrink-0" />
          <div>
            <h3 className="text-sm font-semibold leading-tight">
              Aetheria AI Financial & Eco Steward
            </h3>
            <p className="text-[11px] text-emerald-100/80">
              Environment-Aware Gemini Advisor · Consent-Gated
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          title="Minimize AI Steward"
        >
          <Minimize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Consent Toggle Bar */}
      <div className="px-4 py-2.5 bg-[#F4F1EA] border-b border-[#1E293B]/10 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-[#1E293B]/80">
          {state.aiConsentGranted ? (
            <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
          ) : (
            <Lock className="w-4 h-4 text-[#D97706] shrink-0" />
          )}
          <span>
            {state.aiConsentGranted
              ? 'Privacy Consent: Context Sharing Active'
              : 'Privacy Consent: Context Paused'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setAiConsent(!state.aiConsentGranted)}
          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
            state.aiConsentGranted
              ? 'bg-[#10B981]/15 text-[#2D5A27] hover:bg-[#10B981]/25'
              : 'bg-[#D97706] text-white hover:bg-[#B45309]'
          }`}
        >
          {state.aiConsentGranted ? 'Pause Consent' : 'Grant Consent'}
        </button>
      </div>

      {/* Body Content */}
      <div className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
        {errorMsg && (
          <div className="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/25 text-[#EF4444]">
            {errorMsg}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-[#1E293B]/60 font-mono tabular-nums">
            <span>LIVE CONTEXT SNAPSHOT</span>
            <span>
              HP {bossHpPercent}% · {carbonPer100Spent} kg/$100
            </span>
          </div>
          <h4 className="text-sm font-semibold text-[#1E293B]">
            {insight.headline}
          </h4>
          <p className="text-xs text-[#1E293B]/80 leading-relaxed">
            {insight.summary}
          </p>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-[#1E293B]/10">
          <p className="text-[11px] font-semibold text-[#2D5A27]">
            Recommended Next Actions
          </p>
          <ul className="space-y-1.5">
            {insight.actionItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[#1E293B]/85 leading-relaxed">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-2 border-t border-[#1E293B]/10 flex items-center justify-between gap-2">
          <span className="text-[11px] text-[#1E293B]/60 truncate">
            Focus: {insight.suggestedFeature}
          </span>
          <button
            type="button"
            disabled={loading}
            onClick={() => runAiRequest('audit')}
            className="px-3 py-1.5 bg-[#D97706] hover:bg-[#B45309] disabled:opacity-50 text-white font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Auditing...' : 'Run Full Eco-Audit'}
          </button>
        </div>
      </div>

      {/* Prompt Input Footer */}
      <form
        onSubmit={handleFormSubmit}
        className="p-3 bg-[#F4F1EA] border-t border-[#1E293B]/10 flex items-center gap-2"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={!state.aiConsentGranted || loading}
          placeholder={
            state.aiConsentGranted
              ? 'Ask about budget swaps, APY, or carbon...'
              : 'Enable consent above to chat...'
          }
          className="flex-1 px-3 py-2 text-xs bg-white border border-[#1E293B]/15 rounded-lg focus:outline-none focus:border-[#2D5A27] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!state.aiConsentGranted || loading || !query.trim()}
          className="px-3 py-2 bg-[#2D5A27] hover:bg-[#23471E] disabled:opacity-40 text-white rounded-lg transition-colors cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </aside>
  );
};
