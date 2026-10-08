/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, SlidersHorizontal, CheckCircle2, X } from 'lucide-react';
import { AetheriaProvider, useAetheria } from './context/AetheriaContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TerrariumViewport } from './components/TerrariumViewport';
import { QuestVaultsSection } from './components/QuestVaultsSection';
import { EcoLedgerSection } from './components/EcoLedgerSection';
import { DailyLoopsSection } from './components/DailyLoopsSection';
import { AetheriaAiWidget } from './components/AetheriaAiWidget';
import { LogReceiptModal, SanctuarySettingsModal } from './components/Modals';

const AetheriaWorkspace: React.FC = () => {
  const {
    state,
    monthlySpend,
    budgetRemaining,
    carbonPer100Spent,
    activeSubDrainMonthly,
    pendingTriageTransactions,
    lastActionToast,
    clearToast,
  } = useAetheria();

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1EA] text-[#1E293B]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-[#F4F1EA]/95 backdrop-blur-md border-b border-[#1E293B]/12 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark in Fraunces display face */}
        <a
          href="#top"
          className="font-display text-xl font-bold tracking-tight text-[#2D5A27] whitespace-nowrap shrink-0"
        >
          Aetheria
        </a>

        {/* Zone 2: 4-5 clean text navigation links with subtle hover underlines */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#1E293B]/75">
          <a
            href="#terrarium"
            className="hover:text-[#2D5A27] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Terrarium
          </a>
          <a
            href="#quest-vaults"
            className="hover:text-[#2D5A27] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Quest Vaults
          </a>
          <a
            href="#eco-ledger"
            className="hover:text-[#2D5A27] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Eco-Ledger
          </a>
          <a
            href="#daily-loops"
            className="hover:text-[#2D5A27] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Daily Loops ({pendingTriageTransactions.length})
          </a>
          <button
            type="button"
            onClick={() => setIsSettingsModalOpen(true)}
            className="hover:text-[#2D5A27] hover:underline underline-offset-4 transition-colors whitespace-nowrap cursor-pointer"
          >
            Calibration
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsSettingsModalOpen(true)}
            className="p-2 text-[#1E293B]/70 hover:text-[#1E293B] border border-[#1E293B]/15 rounded-lg transition-colors cursor-pointer"
            title="Sanctuary Settings & Privacy"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsReceiptModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#2D5A27] hover:bg-[#23471E] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Log Receipt
          </button>
        </div>
      </header>

      {/* Live Action Feedback Toast Banner */}
      {lastActionToast && (
        <div className="bg-[#2D5A27] text-white px-4 sm:px-8 py-2.5 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span className="font-medium">{lastActionToast}</span>
          </div>
          <button
            type="button"
            onClick={clearToast}
            className="text-white/80 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Content Container (1440px Desktop Baseline, Generous Section Rhythm) */}
      <main id="top" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-16">
        {/* Hero Section: Editorial Intro + Top-Level Tabular Telemetry Strip + 3D Floating Island */}
        <div id="terrarium" className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="text-xs text-[#2D5A27] font-semibold">
                <span>2027 Organic Solarpunk Stewardship</span>
                <span aria-hidden="true" className="mx-2">·</span>
                <span className="font-mono tabular-nums">
                  {state.xp.toLocaleString()} XP (Level {state.level})
                </span>
                <span aria-hidden="true" className="mx-2">·</span>
                <span className="font-mono tabular-nums">
                  {state.greenGuildTokens} Green Guild Tokens
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-semibold text-[#1E293B] tracking-tight">
                Cultivate Your Capital & Living Canopy
              </h1>
            </div>

            {/* Clean Unboxed Tabular Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#1E293B]/10">
              <div>
                <span className="text-xs text-[#1E293B]/65 block">Monthly Budget Left</span>
                <span className="font-mono tabular-nums text-lg font-semibold text-[#10B981]">
                  ${budgetRemaining.toFixed(0)}
                </span>
                <span className="text-[11px] text-[#1E293B]/55 block font-mono tabular-nums">
                  of ${state.monthlyBudget.toLocaleString()} (${monthlySpend.toFixed(0)} spent)
                </span>
              </div>

              <div>
                <span className="text-xs text-[#1E293B]/65 block">Micro-Savings Vault</span>
                <span className="font-mono tabular-nums text-lg font-semibold text-[#2D5A27]">
                  ${state.microSavingsBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-[#1E293B]/55 block font-mono tabular-nums">
                  {(state.baseApy + state.bonusApy).toFixed(2)}% Eco-Index APY
                </span>
              </div>

              <div>
                <span className="text-xs text-[#1E293B]/65 block">Sub Leech Drain</span>
                <span className="font-mono tabular-nums text-lg font-semibold text-[#EF4444]">
                  ${activeSubDrainMonthly.toFixed(2)}/mo
                </span>
                <span className="text-[11px] text-[#1E293B]/55 block">
                  {state.subscriptions.filter((s) => s.status === 'ACTIVE_LEECH').length} active bosses
                </span>
              </div>

              <div>
                <span className="text-xs text-[#1E293B]/65 block">Carbon-to-Capital</span>
                <span className="font-mono tabular-nums text-lg font-semibold text-[#1E293B]">
                  {carbonPer100Spent} kg/$100
                </span>
                <span className="text-[11px] text-[#10B981] block font-medium">
                  {state.treesPlanted} native trees planted
                </span>
              </div>
            </div>
          </div>

          {/* Interactive 3D Floating Terrarium / Island Hero Widget */}
          <TerrariumViewport />
        </div>

        {/* Feature 2: Dynamic Micro-Savings & Quest Vaults */}
        <section id="quest-vaults">
          <QuestVaultsSection />
        </section>

        {/* Feature 3: Eco-Budgeting & Carbon Alignment */}
        <section id="eco-ledger">
          <EcoLedgerSection onOpenNewTxModal={() => setIsReceiptModalOpen(true)} />
        </section>

        {/* Feature 4: Daily Retention Loops */}
        <section id="daily-loops">
          <DailyLoopsSection />
        </section>
      </main>

      {/* Clean Quiet Footer */}
      <footer className="border-t border-[#1E293B]/10 bg-[#FAF8F3] py-6 px-4 sm:px-8 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#1E293B]/65">
          <div>
            <span>Aetheria · Regenerative Micro-Savings & Carbon-Aligned Budgeting</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(true)}
              className="hover:text-[#1E293B] transition-colors cursor-pointer"
            >
              Privacy Consent & Budget Calibration
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setIsReceiptModalOpen(true)}
              className="hover:text-[#1E293B] transition-colors cursor-pointer"
            >
              Log Receipt
            </button>
          </div>
        </div>
      </footer>

      {/* Environment-Aware Floating AI Advisor Widget */}
      <AetheriaAiWidget />

      {/* Modals */}
      <LogReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
      />
      <SanctuarySettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AetheriaProvider>
        <AetheriaWorkspace />
      </AetheriaProvider>
    </ErrorBoundary>
  );
}
