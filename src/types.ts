export type BillingCycle = 'monthly' | 'annual' | 'quarterly';

export type SubscriptionCategory = 
  | 'Developer & AI'
  | 'Design & Creative'
  | 'Cloud & Infra'
  | 'Productivity & Storage'
  | 'Security & Utilities';

export type SubscriptionStatus = 'active' | 'paused' | 'cancelled';

export interface Subscription {
  id: string;
  name: string;
  provider: string;
  iconName: string;
  category: SubscriptionCategory;
  amount: number; // monthly equivalent in USD
  billingCycle: BillingCycle;
  billedAmount: number;
  status: SubscriptionStatus;
  renewalDate: string; // ISO date string e.g. "2026-09-25"
  daysUntilRenewal: number;
  usageScore: number; // 1 to 5
  isAiTool: boolean;
  notes?: string;
  color: string;
  features?: string[];
  redundancyWith?: string[];
  lastUsedDaysAgo: number;
}

export interface AiOptimizerInsight {
  id: string;
  type: 'redundancy' | 'underused' | 'tier_optimization';
  title: string;
  potentialSavings: number; // monthly savings in USD
  severity: 'high' | 'medium' | 'low';
  description: string;
  actionText: string;
  affectedSubscriptions: string[];
}

export type ViewTab = 'dashboard' | 'subs' | 'ai_stack' | 'savings' | 'analytics';

export interface UrgentRenewal {
  id: string;
  subscriptionId: string;
  name: string;
  amount: number;
  renewalDate: string;
  daysRemaining: number;
  category: string;
  autoChargeRisk: 'imminent' | 'standard';
}

export interface SpendingCapConfig {
  monthlyCap: number;
  alertAt80: boolean;
  alertAt100: boolean;
  isEnabled: boolean;
}
