import React, { useState } from 'react';
import {
  Leaf,
  Search,
  TreePine,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { useAetheria } from '../context/AetheriaContext';
import { CarbonTier } from '../types/aetheria';
import reforestImgUrl from '../assets/images/guild_canopy_reforest_1791438857717.jpg';

interface EcoLedgerSectionProps {
  onOpenNewTxModal: () => void;
}

export const EcoLedgerSection: React.FC<EcoLedgerSectionProps> = ({ onOpenNewTxModal }) => {
  const {
    state,
    totalCarbonKg,
    carbonPer100Spent,
    redeemTreePlanting,
  } = useAetheria();

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'ALL' | CarbonTier>('ALL');
  const [imgError, setImgError] = useState(false);

  const filteredTransactions = state.transactions.filter((tx) => {
    const matchesTier = tierFilter === 'ALL' || tx.carbonTier === tierFilter;
    const matchesSearch =
      tx.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.ecoSwapSuggestion.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const impactGrade =
    carbonPer100Spent <= 9.0
      ? 'A+ Regenerative Steward'
      : carbonPer100Spent <= 14.5
      ? 'B+ Transitional Canopy'
      : 'C High-Carbon Drift';

  return (
    <div className="space-y-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1E293B]/10 pb-5">
        <div>
          <p className="text-xs text-[#2D5A27] font-semibold">
            02. Eco-Budgeting & Carbon-to-Capital Alignment
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#1E293B] mt-1">
            Carbon-Adjusted Receipts & Reforestation Offset Stacking
          </h2>
        </div>

        <button
          type="button"
          onClick={onOpenNewTxModal}
          className="px-4 py-2 text-xs font-semibold bg-[#2D5A27] hover:bg-[#23471E] text-white rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Log Carbon-Adjusted Receipt
        </button>
      </div>

      {/* Top Row: Carbon-to-Capital Score + Green Guild Reforestation Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 5 Cols: Unified Carbon-to-Capital Telemetry */}
        <div className="lg:col-span-5 bg-[#FAF8F3] border border-[#1E293B]/12 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="text-xs text-[#2D5A27] font-semibold flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              <span>Unified Carbon-to-Capital Rating</span>
            </div>
            <h3 className="text-2xl font-semibold text-[#1E293B] font-mono tabular-nums">
              {carbonPer100Spent} kg CO₂e / $100
            </h3>
            <p className="text-xs text-[#1E293B]/70">
              Current Classification: <strong className="text-[#2D5A27]">{impactGrade}</strong> · Total Tracked Mass: {totalCarbonKg} kg CO₂e
            </p>
            <p className="text-sm text-[#1E293B]/80 leading-relaxed pt-1">
              Every low-carbon purchase (bulk refills, secondhand goods, solar transit) reduces your carbon-to-capital ratio and mints Green Guild Tokens.
            </p>
          </div>

          <div className="divide-y divide-[#1E293B]/10 border-t border-[#1E293B]/10 pt-2 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-[#1E293B]/70">Green Guild Tokens Available</span>
              <span className="font-mono tabular-nums font-semibold text-[#2D5A27]">
                {state.greenGuildTokens} Tokens
              </span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-[#1E293B]/70">Verified Native Saplings Planted</span>
              <span className="font-mono tabular-nums font-semibold text-[#10B981]">
                {state.treesPlanted} Trees ({state.treesPlanted * 22} kg CO₂/yr offset)
              </span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-[#1E293B]/70">Next Reforestation Milestone</span>
              <span className="font-mono tabular-nums text-[#1E293B]">
                15 Trees (+0.25% Guild APY)
              </span>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Reforestation Corridor Visual Card & Redemption */}
        <div className="lg:col-span-7 bg-[#FAF8F3] border border-[#1E293B]/12 rounded-2xl overflow-hidden flex flex-col sm:flex-row">
          <div className="sm:w-2/5 h-48 sm:h-auto relative bg-[#2D5A27] shrink-0">
            {!imgError ? (
              <img
                src={reforestImgUrl}
                alt="Cascadia Solarpunk Reforestation Valley"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <TreePine className="w-12 h-12 text-white/70" />
              </div>
            )}
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="text-xs text-[#2D5A27] font-semibold">
                <span>Eco-Offset Stacking</span>
                <span aria-hidden="true" className="mx-1.5">·</span>
                <span>5 Tokens = 1 Native Tree</span>
              </div>
              <h3 className="text-xl font-semibold text-[#1E293B]">
                Cascadia & Alpine Riparian Canopy Project
              </h3>
              <p className="text-sm text-[#1E293B]/75 leading-relaxed">
                Redeem tokens earned from thrifting, home cooking, and public transit to fund verified Douglas Fir and Western Red Cedar saplings alongside community solar waterwheels.
              </p>
            </div>

            <div className="pt-3 border-t border-[#1E293B]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-[#1E293B]/75 font-mono tabular-nums">
                Your Balance: <strong>{state.greenGuildTokens} Tokens</strong>
              </div>
              <button
                type="button"
                onClick={redeemTreePlanting}
                disabled={state.greenGuildTokens < 5}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  state.greenGuildTokens >= 5
                    ? 'bg-[#2D5A27] hover:bg-[#23471E] text-white cursor-pointer'
                    : 'bg-[#1E293B]/10 text-[#1E293B]/45 cursor-not-allowed'
                }`}
              >
                <TreePine className="w-3.5 h-3.5" />
                Redeem 5 Tokens → Plant 1 Sapling (+110 XP)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Carbon-Adjusted Receipts Ledger Table */}
      <div className="bg-[#FAF8F3] border border-[#1E293B]/12 rounded-2xl p-6 space-y-5">
        {/* Table Controls: Search + Interactive Segmented Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#1E293B]/45 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search merchant, category, or eco-swap recommendation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#1E293B]/15 rounded-lg focus:outline-none focus:border-[#2D5A27]"
            />
          </div>

          {/* Interactive Filter Controls (Buttons allowed per Zero-Pill rules) */}
          <div className="flex items-center gap-1 p-1 bg-[#F4F1EA] border border-[#1E293B]/10 rounded-lg self-start">
            {(
              [
                { id: 'ALL', label: 'All Receipts' },
                { id: CarbonTier.LOW, label: 'Low Carbon' },
                { id: CarbonTier.MODERATE, label: 'Moderate' },
                { id: CarbonTier.HIGH, label: 'High Carbon' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTierFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  tierFilter === tab.id
                    ? 'bg-white text-[#1E293B] shadow-xs font-semibold'
                    : 'text-[#1E293B]/65 hover:text-[#1E293B]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* High-Density SaaS Ledger Table */}
        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center space-y-3 border-t border-[#1E293B]/10">
            <p className="text-sm font-medium text-[#1E293B]">
              No carbon-adjusted receipts match your current filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setTierFilter('ALL');
              }}
              className="px-4 py-2 text-xs font-semibold text-[#2D5A27] border border-[#2D5A27]/30 rounded-lg hover:bg-[#2D5A27]/5 transition-colors"
            >
              Reset Ledger Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto border-t border-[#1E293B]/10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1E293B]/10 text-xs text-[#1E293B]/65 font-medium">
                  <th className="py-3 pr-4">Merchant & Category</th>
                  <th className="py-3 px-4">Eco-Swap & Carbon Insight</th>
                  <th className="py-3 px-4 text-right">Carbon Mass</th>
                  <th className="py-3 px-4 text-right">Round-Up</th>
                  <th className="py-3 pl-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/8 text-xs">
                {filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-[#1E293B]/[0.02] transition-colors"
                  >
                    <td className="py-3.5 pr-4 align-top">
                      <div className="font-semibold text-sm text-[#1E293B]">
                        {tx.merchant}
                      </div>
                      {/* Clean unboxed metadata with typographic separators */}
                      <div className="text-xs text-[#1E293B]/60 mt-0.5">
                        <span>{tx.category}</span>
                        <span aria-hidden="true" className="mx-1.5">·</span>
                        <span>{tx.date}</span>
                        {tx.potentialTokenReward > 0 && (
                          <>
                            <span aria-hidden="true" className="mx-1.5">·</span>
                            <span className="text-[#2D5A27] font-medium">
                              +{tx.potentialTokenReward} Guild Tokens
                            </span>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-top max-w-md text-[#1E293B]/75 leading-relaxed">
                      {tx.ecoSwapSuggestion}
                    </td>

                    <td className="py-3.5 px-4 align-top text-right font-mono tabular-nums whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        {tx.carbonTier === CarbonTier.LOW ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                        ) : tx.carbonTier === CarbonTier.MODERATE ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
                        ) : (
                          <Flame className="w-3.5 h-3.5 text-[#EF4444]" />
                        )}
                        <span
                          className={
                            tx.carbonTier === CarbonTier.LOW
                              ? 'text-[#10B981] font-semibold'
                              : tx.carbonTier === CarbonTier.MODERATE
                              ? 'text-[#D97706] font-semibold'
                              : 'text-[#EF4444] font-semibold'
                          }
                        >
                          {tx.carbonMassKg.toFixed(1)} kg CO₂e
                        </span>
                      </div>
                      <div className="text-[11px] text-[#1E293B]/55">
                        {tx.carbonTier === CarbonTier.LOW
                          ? 'Low Footprint'
                          : tx.carbonTier === CarbonTier.MODERATE
                          ? 'Moderate'
                          : 'High Intensity'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-top text-right font-mono tabular-nums text-[#8B5CF6] font-medium whitespace-nowrap">
                      +${tx.roundUpAmount.toFixed(2)}
                    </td>

                    <td className="py-3.5 pl-4 align-top text-right font-mono tabular-nums text-sm font-semibold text-[#1E293B] whitespace-nowrap">
                      ${tx.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
