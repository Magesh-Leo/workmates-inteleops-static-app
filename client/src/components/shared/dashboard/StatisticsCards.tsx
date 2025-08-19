import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Flame, Clock, Flag, Gauge, TrendingDown, Clipboard, TrendingUp } from "lucide-react";

interface StatisticsCardsProps {
  statistics: {
    totalTickets: number;
    dailyAverage: number;
    peakDay: { date: string; count: number };
    trend: number;
    zohoAutomationLambdaAverageDurationMs: number;
    zohoAutomationLambdaMinDurationMs: number;
    zohoAutomationLambdaMaxDurationMs: number;
  };
  dateRange: {
    start: string;
    end: string;
    days: number;
  };
}

export function StatisticsCards({ statistics, dateRange }: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total Tickets */}
      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-4 flex items-center gap-3">
          <Clipboard className="w-6 h-6 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Total Tickets</p>
            <p className="text-xl font-semibold">{statistics?.totalTickets?.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      {/* Daily Average */}
      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-4 flex items-center gap-3">
          <Calendar className="w-6 h-6 text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Daily Average</p>
            <p className="text-xl font-semibold">{statistics?.dailyAverage}</p>
            <span
              className={`text-xs flex items-center gap-1 ${
                statistics?.trend >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {statistics?.trend >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(statistics?.trend ?? 0)}% vs last period
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Peak Day */}
      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-4 flex items-center gap-3">
          <Flame className="w-6 h-6 text-orange-500" />
          <div>
            <p className="text-sm text-gray-500">Peak Day</p>
            <p className="text-xl font-semibold">{statistics?.peakDay?.count}</p>
            <p className="text-xs text-gray-500">{statistics?.peakDay?.date}</p>
          </div>
        </CardContent>
      </Card>

      {/* Data Range */}
      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-4 flex items-center gap-3">
          <Gauge className="w-6 h-6 text-purple-500" />
          <div>
            <p className="text-sm text-gray-500">Data Range</p>
            <p className="text-xl font-semibold">{dateRange?.days}d</p>
            <p className="text-xs text-gray-500">{dateRange?.days} data points</p>
          </div>
        </CardContent>
      </Card>

      {/* Avg Response Time */}
      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-4 flex items-center gap-3">
          <Clock className="w-6 h-6 text-indigo-500" />
          <div>
            <p className="text-sm text-gray-500">Avg Response Time</p>
            <p className="text-xl font-semibold">{statistics?.zohoAutomationLambdaAverageDurationMs?.toFixed(2)} ms</p>
          </div>
        </CardContent>
      </Card>

      {/* Min Response Time */}
      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-4 flex items-center gap-3">
          <Gauge className="w-6 h-6 text-teal-500" />
          <div>
            <p className="text-sm text-gray-500">Min Response Time</p>
            <p className="text-xl font-semibold">{statistics?.zohoAutomationLambdaMinDurationMs?.toFixed(2)} ms</p>
          </div>
        </CardContent>
      </Card>

      {/* Max Response Time */}
      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-4 flex items-center gap-3">
          <Flag className="w-6 h-6 text-pink-500" />
          <div>
            <p className="text-sm text-gray-500">Max Response Time</p>
            <p className="text-xl font-semibold">{statistics?.zohoAutomationLambdaMaxDurationMs?.toFixed(2)} ms</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
