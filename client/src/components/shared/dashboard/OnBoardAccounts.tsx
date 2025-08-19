import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { OnboardedAccount } from "@/types/dashboard";
import { Users, Building2, Globe2, UserCheck } from "lucide-react"; // ✅ Lucide icons

export default function OnBoardAccounts({ onboardedAccounts }: { onboardedAccounts: OnboardedAccount[] }) {
  const totalAccounts = onboardedAccounts?.length ?? 0;
  const uniqueTeams = new Set(onboardedAccounts?.map(acc => acc.teamName))?.size || 0;
  const uniqueRegions = new Set(onboardedAccounts?.map(acc => acc.regions))?.size || 0;
  const onboardedCount = totalAccounts;

  const stats = [
    { label: "Onboarded Accounts", value: onboardedCount, icon: Users },
    { label: "Total Accounts", value: totalAccounts, icon: Building2 },
    { label: "Unique Teams", value: uniqueTeams, icon: UserCheck },
    { label: "Unique Regions", value: uniqueRegions, icon: Globe2 },
  ];

  const kpiData = [
    {
      title: "Auto-Resolution Rate",
      value: "94.2%",
      trend: "+23%",
      trendType: "positive",
      description: "847 tickets resolved automatically this week"
    },
    {
      title: "Cost Savings (Weekly)",
      value: "$1150",
      trend: "+47%",
      trendType: "positive",
      description: "Based on 168 hours saved @ $7/hr"
    },
    {
      title: "Mean Time to Resolution",
      value: "2.8 min",
      trend: "-91%",
      trendType: "improvement",
      description: "Reduced from 32 minutes average"
    },
    {
      title: "SLA Compliance",
      value: "99.1%",
      trend: "+12%",
      trendType: "positive",
      description: "Exceeding all service level agreements"
    },
    {
      title: "First Contact Resolution",
      value: "94.2%",
      trend: "+31%",
      trendType: "improvement",
      description: "Issues resolved on initial contact"
    },
    {
      title: "Downtime Prevented",
      value: "47.2 hrs",
      trend: "$189K",
      trendType: "positive",
      description: "Critical incidents auto-resolved"
    }
  ];

  const getTrendColor = (trendType: string) => {
    switch (trendType) {
      case "positive":
        return "text-green-600 bg-green-100";
      case "improvement":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="space-y-4">
      {/* Section Title */}
      <h2 className="text-xl font-bold text-gray-900">OnBoarded Accounts</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center gap-4 p-4">
              <stat.icon className="w-8 h-8 text-blue-600" /> {/* ✅ Lucide Icon */}
              <div>
                <p className="text-xl font-semibold">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Section Title */}
      <h2 className="text-xl font-bold text-gray-900">Business Performance</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="rounded-2xl shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-600">{kpi.title}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTrendColor(kpi.trendType)}`}>
                  {kpi.trend}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {kpi.value}
              </div>
              <p className="text-sm text-gray-500">
                {kpi.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
