import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquare, 
  Send, 
  Lock, 
  Clock, 
  ShieldCheck, 
  Building2, 
  Phone, 
  Mail, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const { 
    conversations, 
    sendMessage, 
    activeSubscription, 
    toggleSubscriptionExpirySimulation,
    navigate,
    currentUser 
  } = useApp();

  const [activeConvId, setActiveConvId] = useState<string>(conversations[0]?.id || '');
  const [inputText, setInputText] = useState('');

  // Developer-only state preview control. Excluded from production builds.
  const IS_DEV = import.meta.env.DEV;

  const activeConversation = conversations.find((c) => c.id === activeConvId) || conversations[0];
  const isAccessActive = activeSubscription && activeSubscription.isActive;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    if (!isAccessActive) return;

    sendMessage(activeConversation.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header & Entitlement Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Direct Inquiry Communication</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Seller & Agent Messages
            </h1>
          </div>

          {/* Entitlement Status Pill & Simulation Toggle */}
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-2 ${
              isAccessActive
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>
                {isAccessActive
                  ? `AI Connect Active (Expires ${activeSubscription?.expiryDate})`
                  : 'AI Connect Access Inactive / Expired'}
              </span>
            </div>

            {IS_DEV && (
              <button
                onClick={toggleSubscriptionExpirySimulation}
                className="px-3 py-1.5 bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                title="Preview active and expired states"
              >
                Preview Expired State
              </button>
            )}
          </div>
        </div>

        {/* Messaging Layout: 2 Columns */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[620px]">
          {/* Left Column: Conversation List */}
          <aside className="md:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Active Conversations ({conversations.length})
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-y-auto max-h-[540px]">
                {conversations.map((conv) => {
                  const isSelected = conv.id === activeConversation?.id;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConvId(conv.id)}
                      className={`w-full text-left p-4 transition-colors cursor-pointer flex items-start gap-3 ${
                        isSelected ? 'bg-teal-50/60 dark:bg-teal-950/50' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <img
                        src={conv.propertyImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80'}
                        alt={conv.propertyTitle}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {conv.otherPartyName}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">{conv.lastMessageTime}</span>
                        </div>
                        <div className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold truncate mt-0.5">
                          {conv.propertyTitle}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                          {conv.lastMessage}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 text-xs text-slate-500 dark:text-slate-400">
              Inquiries protected by AI Connect encryption.
            </div>
          </aside>

          {/* Right Column: Chat History & Input */}
          <main className="md:col-span-8 flex flex-col justify-between">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeConversation.otherPartyAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                      alt={activeConversation.otherPartyName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">
                        {activeConversation.otherPartyName}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {activeConversation.otherPartyRole} · Regarding{' '}
                        <button
                          onClick={() => navigate(`/properties/${activeConversation.propertyId}`)}
                          className="text-teal-700 dark:text-teal-400 font-semibold hover:underline"
                        >
                          {activeConversation.propertyTitle}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Disclosed Phone/Email if active */}
                  {isAccessActive && (
                    <div className="hidden lg:flex items-center gap-4 text-xs text-slate-700 dark:text-slate-300 font-medium bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <span className="font-mono text-[11px]">+1 (555) 876-5432</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <span className="font-mono text-[11px]">agent@apexrealty.com</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Log */}
                <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[440px] bg-white dark:bg-slate-900">
                  {activeConversation.messages.map((msg, idx) => {
                    const isMe = msg.senderRole === 'buyer' || msg.senderName === 'You' || msg.senderName === currentUser?.name;
                    return (
                      <div
                        key={msg.id || `msg-${idx}`}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 mb-1 px-1">
                          {msg.senderName} · {msg.timestamp}
                        </div>
                        <div
                          className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-slate-900 dark:bg-teal-700 text-white rounded-br-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Input Area or Expired Banner */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  {isAccessActive ? (
                    <form onSubmit={handleSend} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type your inquiry or schedule a tour request..."
                        className="flex-1 px-4 py-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-900 dark:text-white"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send</span>
                      </button>
                    </form>
                  ) : (
                    /* Expired / Inactive Restriction (FR-CONNECT-10 & 11) */
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200">
                          <Lock className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                          <span>Direct Messaging Locked</span>
                        </div>
                        <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-snug">
                          Your AI Connect pass is either expired or inactive. Upgrade to a transparent 7, 30, or 90-day pass to continue conversation access.
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/connect')}
                        className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-lg transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>View Plans</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                <MessageSquare className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2" />
                <span>No active conversation selected.</span>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
