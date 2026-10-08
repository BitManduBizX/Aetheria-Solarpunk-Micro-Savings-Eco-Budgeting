import React, { useState } from 'react';
import { X, PlusCircle, ShieldCheck, Download, RotateCcw } from 'lucide-react';
import { useAetheria } from '../context/AetheriaContext';
import { CarbonTier } from '../types/aetheria';

interface LogReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogReceiptModal: React.FC<LogReceiptModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction } = useAetheria();
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState('Groceries & Pantry');
  const [amount, setAmount] = useState('');
  const [carbonTier, setCarbonTier] = useState<CarbonTier>(CarbonTier.LOW);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!merchant.trim() || isNaN(num) || num <= 0) return;
    addTransaction({
      merchant,
      category,
      amount: num,
      carbonTier,
    });
    setMerchant('');
    setAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF8F3] border border-[#1E293B]/20 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#1E293B]/10 pb-3">
          <div>
            <p className="text-xs font-semibold text-[#2D5A27]">
              Carbon-Adjusted Receipt Entry
            </p>
            <h3 className="text-lg font-semibold text-[#1E293B]">
              Log Purchase & Auto-Round Spare Change
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#1E293B]/60 hover:text-[#1E293B] rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="block font-semibold text-[#1E293B]">
              Merchant or Cooperative Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Greenleaf Farmers Market"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#1E293B]/15 rounded-lg focus:outline-none focus:border-[#2D5A27]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block font-semibold text-[#1E293B]">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="0.5"
                required
                placeholder="24.30"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 font-mono bg-white border border-[#1E293B]/15 rounded-lg focus:outline-none focus:border-[#2D5A27]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-[#1E293B]">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#1E293B]/15 rounded-lg focus:outline-none focus:border-[#2D5A27]"
              >
                <option value="Groceries & Pantry">Groceries & Pantry</option>
                <option value="Cafe & Craft">Cafe & Craft</option>
                <option value="Mobility & Transit">Mobility & Transit</option>
                <option value="Apparel & Repair">Apparel & Repair</option>
                <option value="Dining & Delivery">Dining & Delivery</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-[#1E293B]">
              Carbon Alignment Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  tier: CarbonTier.LOW,
                  title: 'Low Carbon',
                  desc: '+2 Guild Tokens · Refill / Transit / Thrift',
                },
                {
                  tier: CarbonTier.MODERATE,
                  title: 'Moderate',
                  desc: '+1 Guild Token · Standard Retail',
                },
                {
                  tier: CarbonTier.HIGH,
                  title: 'High Carbon',
                  desc: '0 Tokens · Air Courier / Fast Fashion',
                },
              ].map((option) => (
                <button
                  key={option.tier}
                  type="button"
                  onClick={() => setCarbonTier(option.tier)}
                  className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                    carbonTier === option.tier
                      ? 'border-[#2D5A27] bg-[#2D5A27]/10'
                      : 'border-[#1E293B]/12 bg-white'
                  }`}
                >
                  <div className="font-semibold text-[#1E293B]">{option.title}</div>
                  <div className="text-[11px] text-[#1E293B]/65 mt-0.5 leading-snug">
                    {option.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#1E293B]/70 hover:text-[#1E293B]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-[#2D5A27] hover:bg-[#23471E] text-white rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Save & Round Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface SanctuarySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SanctuarySettingsModal: React.FC<SanctuarySettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { state, setAiConsent, updateMonthlyBudget, resetDemoData } = useAetheria();
  const [budgetInput, setBudgetInput] = useState(state.monthlyBudget.toString());

  if (!isOpen) return null;

  const handleBudgetSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMonthlyBudget(Number(budgetInput));
  };

  const handleExportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(state, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', 'aetheria-eco-ledger-2027.json');
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF8F3] border border-[#1E293B]/20 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#1E293B]/10 pb-3">
          <div>
            <p className="text-xs font-semibold text-[#2D5A27]">
              Privacy-First Governance & Sanctuary Settings
            </p>
            <h3 className="text-lg font-semibold text-[#1E293B]">
              Budget Calibration, AI Telemetry Consent & Ledger Export
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#1E293B]/60 hover:text-[#1E293B] rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Monthly Budget Target */}
          <form onSubmit={handleBudgetSave} className="space-y-2 pb-4 border-b border-[#1E293B]/10">
            <label className="block font-semibold text-[#1E293B]">
              Monthly Eco-Budget Target ($)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="500"
                max="25000"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                className="flex-1 px-3 py-2 font-mono bg-white border border-[#1E293B]/15 rounded-lg"
              />
              <button
                type="submit"
                className="px-4 py-2 font-semibold bg-[#2D5A27] text-white rounded-lg hover:bg-[#23471E] cursor-pointer"
              >
                Update Target
              </button>
            </div>
            <p className="text-[#1E293B]/65">
              Adjusting your monthly budget dynamically updates the 3D island soil moisture and canopy weather biomarkers.
            </p>
          </form>

          {/* Privacy Consent Toggle */}
          <div className="space-y-2 pb-4 border-b border-[#1E293B]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-[#1E293B]">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span>Gemini AI Financial & Carbon Context Consent</span>
              </div>
              <button
                type="button"
                onClick={() => setAiConsent(!state.aiConsentGranted)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  state.aiConsentGranted
                    ? 'bg-[#10B981] text-white'
                    : 'bg-[#1E293B]/15 text-[#1E293B]'
                }`}
              >
                {state.aiConsentGranted ? 'Consent Active' : 'Consent Paused'}
              </button>
            </div>
            <p className="text-[#1E293B]/70 leading-relaxed">
              Aetheria uses server-side Gemini AI with zero client-side key exposure. Toggle consent anytime to control whether anonymized budget health and subscription boss metrics are shared with the AI Steward.
            </p>
          </div>

          {/* Export & Reset */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={handleExportJson}
              className="px-3.5 py-2 font-semibold border border-[#1E293B]/20 text-[#1E293B] rounded-lg hover:bg-[#1E293B]/5 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export Ledger JSON
            </button>

            <button
              type="button"
              onClick={() => {
                resetDemoData();
                onClose();
              }}
              className="px-3.5 py-2 font-semibold text-[#EF4444] border border-[#EF4444]/30 rounded-lg hover:bg-[#EF4444]/10 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo Sanctuary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
