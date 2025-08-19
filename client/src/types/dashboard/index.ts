export interface Filters {
  days: number;
  viewType: ViewType;
  page: number;
  startDate: string;
  endDate: string;
}

export enum ViewType {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
}


export interface DashboardResponse {
  dailyCounts: DailyCount[];
  statistics: Statistics;
  pagination: Pagination;
  dateRange: DateRange;
  viewType: ViewType;
  onboardedAccounts: OnboardedAccount[];
  accountStatistics: AccountStatistics;
}

export interface DailyCount {
  date: string;        // "YYYY-MM-DD"
  ticketCount: number;
}

export interface Statistics {
  totalTickets: number;
  dailyAverage: number;
  peakDay: {
    date: string;      // "YYYY-MM-DD"
    count: number;
  };
  trend: number;
  recentDays: number;
  zohoAutomationLambdaAverageDurationMs: number;
  zohoAutomationLambdaMinDurationMs: number;
  zohoAutomationLambdaMaxDurationMs: number;
}

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalScanned: number;
  hasMore: boolean;
}

export interface DateRange {
  start: string;   // ISO Date
  end: string;     // ISO Date
  days: number;
}

export interface OnboardedAccount {
  accountId: string;
  accountName: string;
  regions: string;
  teamName: string;
}

export interface AccountStatistics {
  totalAccounts: number;
  uniqueTeams: number;
  uniqueRegions: number;
  teamDistribution: Record<string, number>;
  regionDistribution: Record<string, number>;
}