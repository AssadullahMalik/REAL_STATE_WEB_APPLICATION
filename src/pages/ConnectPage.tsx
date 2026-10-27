import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CONNECTION_PLANS } from '../data/mockData';
import { ConnectionPlan } from '../types';
import { 
  ShieldCheck, 
  Check, 
  MessageSquare, 
  Clock, 
  Sparkles, 
  HelpCircle, 
  AlertCircle, 
  CreditCard,
  Calendar,
  ArrowRight
} from 'lucide-react';

export const ConnectPage: React.FC = () => {
  const { 
    activeSubscription, 
    purchaseSubscription, 
    cancelSubscription,
    toggleSubscriptionExpirySimulation,
    navigate,
    addToast
  } = useApp();

  // Developer-only state preview control. Excluded from production builds.
  const IS_DEV = import.meta.env.DEV;

  const [selectedPlan, setSelectedPlan] = useState<ConnectionPlan | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && checkoutModalOpen) {
        setCheckoutModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [checkoutModalOpen]);

  const handleSelectPlan = (plan: ConnectionPlan) => {
    setSelectedPlan(plan);
    setCheckoutModalOpen(true);
  };

  const handleActivatePass = () => {
    if (!selectedPlan) return;
    const result = purchaseSubscription(selectedPlan.id);
    addToast(result.message, result.success ? 'success' : 'error');
    if (result.success) {
      setCheckoutModalOpen(false);
    }
  };

  // Expiry date calculation for selected plan preview
  const previewExpiryDate = () => {
    if (!selectedPlan) return '';
    const d = new Date();
    d.setDate(d.getDate() + selectedPlan.durationDays);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 text-xs font-semibold border border-teal-200 dark:border-teal-800">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Direct Buyer–Seller Communication</span>
            <span>·</span>
            <span>Time-Limited Connection Model</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Connect Plans
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Connect directly with verified property owners and licensed listing agents. Our transparent time-limited passes protect sellers from spam while guaranteeing buyers rapid response rates.
          </p>
        </div>

        {/* Active Entitlement Status Banner (if active or expired) */}
        {activeSubscription && (
          <div className={`p-6 rounded-2xl border shadow-xs max-w-4xl mx-auto ${
            activeSubscription.isActive 
              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200' 
              : 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    activeSubscription.isActive ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                  }`}>
                    {activeSubscription.isActive ? 'Active Entitlement' : 'Subscription Expired'}
                  </span>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{activeSubscription.planName}</span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 flex flex-wrap items-center gap-3">
                  <span>Activated: <strong>{activeSubscription.startDate}</strong></span>
                  <span>·</span>
                  <span>Expiry Date: <strong>{activeSubscription.expiryDate}</strong></span>
                  <span>·</span>
                  <span>Inquiry allowance: <strong>{activeSubscription.inquiriesRemaining}</strong> recorded on this device</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {activeSubscription.isActive ? (
                  <button
                    onClick={() => navigate('/messages')}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Open Messages</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
                    className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Renew Pass
                  </button>
                )}

                {IS_DEV && (
                  <button
                    onClick={toggleSubscriptionExpirySimulation}
                    className="px-3 py-2 bg-white/80 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    title="Preview active and expired states"
                  >
                    Preview Expired State
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {CONNECTION_PLANS.map((plan) => {
            const isSelected = activeSubscription?.planId === plan.id && activeSubscription.isActive;
            return (
              <div
                key={plan.id}
                className={`relative bg-white dark:bg-slate-900 rounded-2xl border transition-all flex flex-col justify-between p-6 sm:p-8 ${
                  plan.popular
                    ? 'border-teal-500 shadow-lg ring-1 ring-teal-500/20'
                    : 'border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Popular / Recommended Tag */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-xs">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="text-base font-bold text-slate-900 dark:text-white mb-1">{plan.name}</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 min-h-8 mb-4">{plan.tagline}</p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                      ${plan.price}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">USD one-time</span>
                  </div>

                  {/* Duration notice */}
                  <div className="flex items-center gap-1.5 text-xs text-teal-700 dark:text-teal-400 font-semibold mb-6">
                    <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>{plan.durationDays} days access · No auto-renew surprises</span>
                  </div>

                  {/* Features list */}
                  <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800 mb-8">
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                        <div className="w-4 h-4 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span className="leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    plan.popular
                      ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-md'
                      : 'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white'
                  }`}
                >
                  {isSelected ? 'Renew / Extend Pass' : `Choose ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Matrix */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs max-w-5xl mx-auto p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Plan Feature Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4 font-semibold">Capability</th>
                  <th className="py-3 px-4 font-semibold">Basic (7 Days)</th>
                  <th className="py-3 px-4 font-semibold text-teal-700 dark:text-teal-400">Pro Partner (30 Days)</th>
                  <th className="py-3 px-4 font-semibold">Investor (90 Days)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">Total Conversations</td>
                  <td className="py-3 px-4">Up to 5 Listings</td>
                  <td className="py-3 px-4 font-bold text-teal-700 dark:text-teal-400">Unlimited</td>
                  <td className="py-3 px-4 font-bold text-teal-700 dark:text-teal-400">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">Direct Phone & Email Unlock</td>
                  <td className="py-3 px-4 text-slate-400 dark:text-slate-500">After seller reply</td>
                  <td className="py-3 px-4 text-emerald-700 dark:text-emerald-400 font-medium">✓ Immediate upon accept</td>
                  <td className="py-3 px-4 text-emerald-700 dark:text-emerald-400 font-medium">✓ Immediate upon accept</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">Inquiry Badge</td>
                  <td className="py-3 px-4 text-slate-400 dark:text-slate-500">Standard</td>
                  <td className="py-3 px-4 text-emerald-700 dark:text-emerald-400 font-medium">★ Verified Buyer</td>
                  <td className="py-3 px-4 text-emerald-700 dark:text-emerald-400 font-medium">★ VIP Investor</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">Auto-Expiry Without Charges</td>
                  <td className="py-3 px-4 text-emerald-700 dark:text-emerald-400 font-medium">✓ Automatic</td>
                  <td className="py-3 px-4 text-emerald-700 dark:text-emerald-400 font-medium">✓ Automatic</td>
                  <td className="py-3 px-4 text-emerald-700 dark:text-emerald-400 font-medium">✓ Automatic</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Understanding the AI Connect model</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-1.5">Why are buyer connections time-limited?</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Real estate brokers and private sellers are bombarded with automated bot spam. By offering transparent paid passes, we verify buyer intent and guarantee sellers a high-yield inquiry pool.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-1.5">Will I be charged after the plan expires?</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                No. Property Partner operates strictly without recurring auto-billing. When your pass ends, your access transitions gracefully with option to renew only if you choose.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-1.5">Is payment collected on this platform?</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                No payment provider is integrated in this build, so no card details are collected and no charge is made. Activating a pass records the entitlement for your account on this device only.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-1.5">What happens when a pass expires?</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Messaging and inquiry actions are blocked until you activate another pass. Expired passes are never renewed automatically.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pass activation review */}
      {checkoutModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">Review Activation</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedPlan.name}</h3>
              </div>
              <button
                onClick={() => setCheckoutModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg cursor-pointer p-1"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Total Cost & Duration Disclosure */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Access Duration:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedPlan.durationDays} Days</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Valid Until:</span>
                <span className="font-bold text-teal-800 dark:text-teal-400">{previewExpiryDate()}</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-900 dark:text-white font-semibold">Total Price:</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                  ${selectedPlan.price}.00 USD
                </span>
              </div>
            </div>

            {/* Transparent billing notice */}
            <div className="p-3 bg-teal-50 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800 rounded-xl text-xs text-teal-900 dark:text-teal-200 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
              <div>
                <strong>No payment is taken:</strong> a payment provider is not integrated in this build, so no card details are collected. Confirming records the pass for your account on this device.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCheckoutModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleActivatePass}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Activate Pass (${selectedPlan.price})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
