import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Platform, Integration, Ticket } from "@shared/schema";

export default function Platforms() {
  const { data: platforms = [], isLoading } = useQuery<Platform[]>({
    queryKey: ["/api/platforms"],
  });

  const { data: integrations = [] } = useQuery<Integration[]>({
    queryKey: ["/api/integrations"],
  });

  const { data: tickets = [] } = useQuery<Ticket[]>({
    queryKey: ["/api/tickets"],
  });

  const getPlatformStats = (platformId: string) => {
    const platformIntegrations = integrations.filter(i => i.platformId === platformId);
    const platformTickets = tickets.filter(t => t.platformId === platformId);
    return {
      integrations: platformIntegrations.length,
      activeIntegrations: platformIntegrations.filter(i => i.isActive).length,
      totalTickets: platformTickets.length,
      automatedTickets: platformTickets.filter(t => t.isAutomated).length,
    };
  };

  if (isLoading) {
    return <div>Loading platforms...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Platforms</h1>
          <p className="text-text-secondary">Manage supported ticketing platforms and their capabilities</p>
        </div>
        <Button className="bg-enterprise-blue hover:bg-blue-700">
          <i className="fas fa-plus mr-2"></i>Add Platform
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((platform) => {
          const stats = getPlatformStats(platform.id);
          return (
            <Card key={platform.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className={platform.icon} style={{ color: platform.color, fontSize: '1.5rem' }}></i>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{platform.name}</CardTitle>
                    <p className="text-sm text-text-secondary capitalize">{platform.type}</p>
                  </div>
                </div>
                <Badge className={platform.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                  {platform.isActive ? "Active" : "Inactive"}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-neutral-bg rounded-lg">
                      <p className="text-2xl font-bold text-text-primary">{stats.integrations}</p>
                      <p className="text-xs text-text-secondary">Integrations</p>
                    </div>
                    <div className="text-center p-3 bg-neutral-bg rounded-lg">
                      <p className="text-2xl font-bold text-text-primary">{stats.totalTickets}</p>
                      <p className="text-xs text-text-secondary">Total Tickets</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Active Integrations</span>
                      <span className="font-medium text-text-primary">{stats.activeIntegrations}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Automated Tickets</span>
                      <span className="font-medium text-text-primary">{stats.automatedTickets}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Automation Rate</span>
                      <span className="font-medium text-text-primary">
                        {stats.totalTickets > 0 ? Math.round((stats.automatedTickets / stats.totalTickets) * 100) : 0}%
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <i className="fas fa-cog mr-2"></i>Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      <i className="fas fa-chart-bar"></i>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Platform capabilities overview */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Capabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Platform</th>
                  <th className="text-left py-3 px-4">Auto-Assignment</th>
                  <th className="text-left py-3 px-4">Priority Escalation</th>
                  <th className="text-left py-3 px-4">Custom Fields</th>
                  <th className="text-left py-3 px-4">Webhooks</th>
                  <th className="text-left py-3 px-4">API Rate Limit</th>
                </tr>
              </thead>
              <tbody>
                {platforms.map((platform) => (
                  <tr key={platform.id} className="border-b">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <i className={platform.icon} style={{ color: platform.color }}></i>
                        <span className="font-medium">{platform.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-100 text-green-800">Supported</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-100 text-green-800">Supported</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className="bg-yellow-100 text-yellow-800">Limited</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-100 text-green-800">Supported</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-text-secondary">1000/hour</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
