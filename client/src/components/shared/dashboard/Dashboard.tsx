import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, RefreshCw, Filter, Calendar, BarChart3 } from "lucide-react";
import { DashboardResponse, Filters, ViewType } from "@/types/dashboard";
import { formatDate } from "@/utils/dateformat";
import OnBoardAccounts from "./OnBoardAccounts";
import { StatisticsCards } from "./StatisticsCards";
import { TicketTrendChart } from "./TicketsTrendsOverTime";
import { TicketDistributionChart } from "./DailyDistribution";

const DashboardC: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const today = new Date();
  const pastDate = new Date();
  pastDate.setDate(today.getDate() - 30);
  const [filters, setFilters] = useState<Filters>({
    days: 30,
    viewType: ViewType.DAILY,
    page: 1,
    startDate: formatDate(pastDate),
    endDate: formatDate(today),
  });

  // API configuration
  const API_BASE_URL =
    "https://32btty8917.execute-api.ap-south-1.amazonaws.com/prod";

  // Function to fetch dashboard data
  const fetchDashboardData = async (filterParams: Filters = filters) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        json: "true",
        days: filterParams.days.toString(),
        viewType: filterParams.viewType,
        page: filterParams.page.toString(),
        startDate: filterParams.startDate,
        endDate: filterParams.endDate,
      });
      const url = `${API_BASE_URL}/dashboard?${queryParams}`;
      console.log("url:::", url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DashboardResponse = await response.json();
      setDashboardData(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle filter changes
  const handleFilterChange = <K extends keyof Filters>(
    key: K,
    value: Filters[K]
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    fetchDashboardData(filters);
  };

  // Reset to page 1 when other filters change
  const handleFilterChangeWithReset = <K extends keyof Filters>(
    key: K,
    value: Filters[K]
  ) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
  };

  // Reset filters to default
  const resetFilters = () => {
    const defaultFilters: Filters = {
      days: 30,
      viewType: ViewType.DAILY,
      page: 1,
      startDate: formatDate(pastDate),
      endDate: formatDate(today),
    };
    setFilters(defaultFilters);
    fetchDashboardData(defaultFilters);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-12">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="text-lg text-gray-600">
              Loading dashboard data...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <OnBoardAccounts onboardedAccounts={dashboardData?.onboardedAccounts!} />
      {/* Filters Card */}
      <Card>
        <div className="flex items-center justify-between">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <div className="flex space-x-2">
            <Button
              onClick={() => fetchDashboardData()}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={resetFilters} variant="outline" size="sm">
              Reset Filters
            </Button>
          </div>
        </div>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            {/* Days Filter */}
            <div className="flex flex-col space-y-1 min-w-[160px]">
              <Label htmlFor="days" className="text-sm font-medium">
                Date Range
              </Label>
              <Select
                value={String(filters.days)}
                onValueChange={(value) => {
                  const days = parseInt(value);
                  const today = new Date();
                  const pastDate = new Date();
                  pastDate.setDate(today.getDate() - days);

                  handleFilterChangeWithReset("days", days);
                  handleFilterChangeWithReset("startDate", formatDate(pastDate));
                  handleFilterChangeWithReset("endDate", formatDate(today));
                }}
              >
                <SelectTrigger id="days" className="h-9">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 Days</SelectItem>
                  <SelectItem value="30">Last 30 Days</SelectItem>
                  <SelectItem value="90">Last 90 Days</SelectItem>
                  <SelectItem value="365">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* View Type Filter */}
            <div className="flex flex-col space-y-1 min-w-[120px]">
              <Label htmlFor="viewType" className="text-sm font-medium">
                View Type
              </Label>
              <Select
                value={filters.viewType}
                onValueChange={(value) =>
                  handleFilterChangeWithReset(
                    "viewType",
                    value as Filters["viewType"]
                  )
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Start Date Filter */}
            <div className="flex flex-col space-y-1 min-w-[140px]">
              <Label htmlFor="startDate" className="text-sm font-medium">
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  handleFilterChangeWithReset("startDate", e.target.value)
                }
                className="h-9"
              />
            </div>

            {/* End Date Filter */}
            <div className="flex flex-col space-y-1 min-w-[140px]">
              <Label htmlFor="endDate" className="text-sm font-medium">
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  handleFilterChangeWithReset("endDate", e.target.value)
                }
                className="h-9"
              />
            </div>

            {/* Apply Button */}
            <div className="flex flex-col space-y-1">
              <Label className="text-sm font-medium opacity-0">Apply</Label>
              <Button
                onClick={handleApplyFilters}
                disabled={loading}
                className="h-9"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Filter className="h-4 w-4 mr-2" />
                    Apply
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <StatisticsCards
        dateRange={dashboardData?.dateRange!}
        statistics={dashboardData?.statistics!}
      />

      {/* Chart */}

      <div className="grid grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-3">
            Ticket Trends Over Time ({dashboardData?.viewType})
          </h2>
          <TicketTrendChart
            range={dashboardData?.viewType!}
            data={dashboardData?.dailyCounts!}
          />
        </div>

        {/* Distribution Chart */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-3">
            Daily Ticket Distribution ({dashboardData?.viewType})
          </h2>
          <TicketDistributionChart
            range={dashboardData?.viewType!}
            data={dashboardData?.dailyCounts!}
          />
        </div>
      </div>

      {/* Error Alert */}
      {/* {error && (
        <Alert variant="destructive">
          <AlertDescription>
            <strong>Error:</strong> {error}
          </AlertDescription>
        </Alert>
      )} */}
    </div>
  );
};

export default DashboardC;
