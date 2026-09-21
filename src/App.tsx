/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  INITIAL_SUBSCRIPTIONS, 
  INITIAL_AI_INSIGHTS 
} from './data/mockSubscriptions';
import { 
  Subscription, 
  AiOptimizerInsight, 
  BillingCycle, 
  ViewTab 
} from './types';

// Components
import { Header } from './components/Header';
import { BillingPerspectiveBar } from './components/BillingPerspectiveBar';
import { MetricCards } from './components/MetricCards';
import { QuickTabPills } from './components/QuickTabPills';
import { WatchdogHero } from './components/WatchdogHero';
import { UrgentRenewals } from './components/UrgentRenewals';
import { CategorySpend } from './components/CategorySpend';
import { ActiveSubsList } from './components/ActiveSubsList';
import { AiOptimizerCard } from './components/AiOptimizerCard';
import { BottomNav } from './components/BottomNav';

// Sub Views
import { SubsView } from './components/views/SubsView';
import { AiStackView } from './components/views/AiStackView';
import { SavingsView } from './components/views/SavingsView';
import { AnalyticsView } from './components/views/AnalyticsView';

// Modals
import { AddSubscriptionModal } from './components/modals/AddSubscriptionModal';
import { AiMatrixModal } from './components/modals/AiMatrixModal';
import { AuditModal } from './components/modals/AuditModal';
import { NotificationsModal } from './components/modals/NotificationsModal';
import { SubscriptionDetailModal } from './components/modals/SubscriptionDetailModal';
import { InvoicesModal } from './components/modals/InvoicesModal';

export default function App() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  const [insights, setInsights] = useState<AiOptimizerInsight[]>(INITIAL_AI_INSIGHTS);
  const [perspective, setPerspective] = useState<BillingCycle>('monthly');
  const [currentTab, setCurrentTab] = useState<ViewTab>('dashboard');
  
  // Baseline mode ($0.00 spend state from screenshot vs active synced spend)
  // Initially false to show the EXACT numbers from the user's screenshot ($0.00 / 0 active subs), with 1-click toggle!
  const [isSimulatedTelemetry, setIsSimulatedTelemetry] = useState<boolean>(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAiMatrixModalOpen, setIsAiMatrixModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isInvoicesOpen, setIsInvoicesOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);

  // Spend calculations
  const activeSubs = subscriptions.filter(s => s.status === 'active');
  const activeCount = isSimulatedTelemetry ? activeSubs.length : 0;
  
  const rawMonthlySpend = activeSubs.reduce((acc, curr) => acc + curr.amount, 0);
  const monthlySpend = isSimulatedTelemetry ? rawMonthlySpend : 0.00;
  const annualRunRate = monthlySpend * 12;

  const rawAiSpend = activeSubs
    .filter(s => s.isAiTool)
    .reduce((acc, curr) => acc + curr.amount, 0);
  const aiToolSpend = isSimulatedTelemetry ? rawAiSpend : 0.00;
  const aiToolPercentage = (isSimulatedTelemetry && monthlySpend > 0)
    ? Math.round((aiToolSpend / monthlySpend) * 100)
    : 0;

  // Identified savings matches the screenshot ($44.98)
  const identifiedSavings = 44.98;

  // Handlers
  const handleAddSubscription = (newSubData: Omit<Subscription, 'id'>) => {
    const newSub: Subscription = {
      ...newSubData,
      id: `sub-${Date.now()}`
    };
    setSubscriptions(prev => [newSub, ...prev]);
    setIsSimulatedTelemetry(true); // Automatically show spend if user adds a custom subscription
  };

  const handleToggleStatus = (subId: string) => {
    setSubscriptions(prev => prev.map(s => {
      if (s.id === subId) {
        return {
          ...s,
          status: s.status === 'active' ? 'paused' : 'active'
        };
      }
      return s;
    }));
  };

  const handleDeleteSubscription = (subId: string) => {
    setSubscriptions(prev => prev.filter(s => s.id !== subId));
    if (selectedSub?.id === subId) {
      setSelectedSub(null);
    }
  };

  const handleUpdateSubscription = (updated: Subscription) => {
    setSubscriptions(prev => prev.map(s => s.id === updated.id ? updated : s));
    setSelectedSub(updated);
  };

  const handleConsolidateAiStack = () => {
    // Retires ChatGPT Pro & Copilot in favor of Claude Pro & Cursor Pro
    setSubscriptions(prev => prev.map(s => {
      if (s.name.includes('ChatGPT') || s.name.includes('Copilot')) {
        return { ...s, status: 'paused', notes: 'Consolidated onto Cursor Pro & Claude Pro' };
      }
      return s;
    }));
    setCurrentTab('savings');
  };

  const handleApplySavingsPlan = (cancelledIds: string[]) => {
    setSubscriptions(prev => prev.map(s => {
      if (cancelledIds.includes(s.id)) {
        return { ...s, status: 'paused', notes: 'Dormant license deactivated via Autonomous Watchdog savings plan' };
      }
      return s;
    }));
    setCurrentTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-[#dfe2ef] flex flex-col font-['Inter'] relative selection:bg-[#6366F1]/30">
      {/* Top Application Header */}
      <Header
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenInvoices={() => setIsInvoicesOpen(true)}
        unreadCount={2}
        isSimulatedTelemetry={isSimulatedTelemetry}
        onToggleTelemetry={() => setIsSimulatedTelemetry(!isSimulatedTelemetry)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-lg mx-auto">
        {currentTab === 'dashboard' && (
          <div className="space-y-1">
            {/* Billing Perspective Bar (Monthly / Annual toggle) */}
            <BillingPerspectiveBar
              perspective={perspective}
              onChangePerspective={setPerspective}
            />

            {/* 4 Metric Cards (Monthly Spend, Annual Run-Rate, AI Share, Identified Savings) */}
            <MetricCards
              monthlySpend={monthlySpend}
              annualRunRate={annualRunRate}
              aiToolPercentage={aiToolPercentage}
              aiToolSpend={aiToolSpend}
              activeCount={activeCount}
              identifiedSavings={identifiedSavings}
              perspective={perspective}
              onSimulateCancellation={() => setCurrentTab('savings')}
            />

            {/* Quick Tab Pills (Dashboard / Subscriptions 8) */}
            <QuickTabPills
              currentTab={currentTab}
              onSelectTab={setCurrentTab}
              subscriptionCount={subscriptions.length}
              onOpenQuickFilter={() => setCurrentTab('subs')}
            />

            {/* SubWise Autonomous Watchdog Hero Banner */}
            <WatchdogHero
              onAddSubscription={() => setIsAddModalOpen(true)}
              onAuditStack={() => setIsAuditModalOpen(true)}
            />

            {/* Urgent Renewals (Next 7 Days) */}
            <UrgentRenewals
              subscriptions={subscriptions}
              onSelectSubscription={(sub) => setSelectedSub(sub)}
              onSnoozeRenewal={(id) => {
                setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, daysUntilRenewal: s.daysUntilRenewal + 7 } : s));
              }}
            />

            {/* Category Spend Distribution */}
            <CategorySpend
              subscriptions={subscriptions}
              totalSpend={monthlySpend}
            />

            {/* Active Subscriptions Overview */}
            <ActiveSubsList
              subscriptions={subscriptions}
              onManageAll={() => setCurrentTab('subs')}
              onSelectSubscription={(sub) => setSelectedSub(sub)}
              onToggleStatus={handleToggleStatus}
            />

            {/* AI Optimizer Insight Box */}
            <AiOptimizerCard
              insights={insights}
              onInspectAiMatrix={() => setIsAiMatrixModalOpen(true)}
              onSimulateCancellation={() => setCurrentTab('savings')}
            />
          </div>
        )}

        {/* Tab 2: Full Subscriptions Registry */}
        {currentTab === 'subs' && (
          <SubsView
            subscriptions={subscriptions}
            onAddSubscription={() => setIsAddModalOpen(true)}
            onToggleStatus={handleToggleStatus}
            onDeleteSubscription={handleDeleteSubscription}
            onSelectSubscription={(sub) => setSelectedSub(sub)}
          />
        )}

        {/* Tab 3: AI Stack Matrix */}
        {currentTab === 'ai_stack' && (
          <AiStackView
            subscriptions={subscriptions}
            onConsolidate={handleConsolidateAiStack}
            onNavigateToSavings={() => setCurrentTab('savings')}
          />
        )}

        {/* Tab 4: Cancellation Simulator & Savings */}
        {currentTab === 'savings' && (
          <SavingsView
            subscriptions={subscriptions}
            onApplySavings={handleApplySavingsPlan}
          />
        )}

        {/* Tab 5: Analytics & Telemetry */}
        {currentTab === 'analytics' && (
          <AnalyticsView
            subscriptions={subscriptions}
          />
        )}
      </main>

      {/* Floating Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        savingsBadge={44.98}
      />

      {/* Modal Dialogs */}
      <AddSubscriptionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSubscription}
      />

      <AiMatrixModal
        isOpen={isAiMatrixModalOpen}
        onClose={() => setIsAiMatrixModalOpen(false)}
        onConsolidate={handleConsolidateAiStack}
      />

      <AuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        onViewSavings={() => setCurrentTab('savings')}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        urgentSubscriptions={subscriptions.filter(s => s.daysUntilRenewal <= 7 && s.status === 'active')}
        onSelectSubscription={(sub) => setSelectedSub(sub)}
      />

      <SubscriptionDetailModal
        subscription={selectedSub}
        isOpen={!!selectedSub}
        onClose={() => setSelectedSub(null)}
        onUpdate={handleUpdateSubscription}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteSubscription}
      />

      <InvoicesModal
        isOpen={isInvoicesOpen}
        onClose={() => setIsInvoicesOpen(false)}
        subscriptions={subscriptions}
      />
    </div>
  );
}
