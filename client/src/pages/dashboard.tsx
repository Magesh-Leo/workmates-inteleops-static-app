import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import IntegrationModal from "@/components/modals/integration-modal";
import OnboardingModal from "@/components/modals/onboarding-modal";
import { useState } from "react";
import type { Ticket, Platform, Integration } from "@shared/schema";
import DashboardC from "@/components/shared/dashboard/Dashboard";

interface Metrics {
  totalTickets: number;
  automatedTickets: number;
  automationRate: number;
  avgResolutionHours: number;
  activeIntegrations: number;
}

export default function Dashboard() {
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  const { data: metrics, isLoading: metricsLoading } = useQuery<Metrics>({
    queryKey: ["/api/metrics"],
  });

  const { data: tickets = [], isLoading: ticketsLoading } = useQuery<Ticket[]>({
    queryKey: ["/api/tickets"],
  });

  const { data: platforms = [] } = useQuery<Platform[]>({
    queryKey: ["/api/platforms"],
  });

  const { data: integrations = [] } = useQuery<Integration[]>({
    queryKey: ["/api/integrations"],
  });

  const recentTickets = tickets.slice(0, 5);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { color: "bg-blue-100 text-blue-800", label: "Open" },
      in_progress: { color: "bg-yellow-100 text-yellow-800", label: "In Progress" },
      resolved: { color: "bg-green-100 text-green-800", label: "Resolved" },
      closed: { color: "bg-gray-100 text-gray-800", label: "Closed" },
      escalated: { color: "bg-red-100 text-red-800", label: "Escalated" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.open;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return "fas fa-question";
    return platform.icon;
  };

  const getPlatformName = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform?.name || "Unknown";
  };

  const getPlatformColor = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform?.color || "#6B7280";
  };

  if (metricsLoading || ticketsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen overflow-y-auto mb-16" style={{
      scrollbarWidth: 'none', /* Firefox */
      msOverflowStyle: 'none', /* IE and Edge */
    }}>
      <div className="p-6 space-y-6">
        <div className="space-y-12">
          <DashboardC />
        </div>

        {/* Key Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Automated</p>
                  <p className="text-3xl font-bold text-text-primary">{metrics?.automatedTickets || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-robot text-success-green text-xl"></i>
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <i className="fas fa-arrow-up text-success-green mr-1"></i>
                <span className="text-success-green font-medium">+{metrics?.automationRate || 0}%</span>
                <span className="text-text-secondary ml-2">automation rate</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">L1 Resolution Rate</p>
                  <p className="text-3xl font-bold text-text-primary">87%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-check-circle text-success-green text-xl"></i>
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <i className="fas fa-arrow-up text-success-green mr-1"></i>
                <span className="text-success-green font-medium">+5%</span>
                <span className="text-text-secondary ml-2">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Active Integrations</p>
                  <p className="text-3xl font-bold text-text-primary">{metrics?.activeIntegrations || 0}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-plug text-purple-600 text-xl"></i>
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <i className="fas fa-check-circle text-success-green mr-1"></i>
                <span className="text-success-green font-medium">All Connected</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Platform Integration */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Tickets */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Tickets</CardTitle>
                <Button variant="link" size="sm">View All</Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-bg">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Platform</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Assigned</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-border">
                      {recentTickets.map((ticket) => (
                        <tr key={ticket.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                            #{ticket.ticketNumber}
                          </td>
                          <td className="px-6 py-4 text-sm text-text-primary">{ticket.subject}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <i 
                                className={`${getPlatformIcon(ticket.platformId || '')} mr-2`}
                                style={{ color: getPlatformColor(ticket.platformId || '') }}
                              ></i>
                              <span className="text-sm text-text-secondary">
                                {getPlatformName(ticket.platformId || '')}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(ticket.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                            {ticket.assignedTo}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Integration Status */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {platforms.map((platform) => {
                const platformIntegrations = integrations.filter(i => i.platformId === platform.id);
                const activeIntegrations = platformIntegrations.filter(i => i.isActive);
                const totalProcessed = tickets.filter(t => t.platformId === platform.id).length;

                return (
                  <div key={platform.id} className="flex items-center justify-between p-4 bg-neutral-bg rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <i className={platform.icon} style={{ color: platform.color }}></i>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{platform.name}</p>
                        <p className="text-xs text-text-secondary">{totalProcessed} tickets processed</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${activeIntegrations.length > 0 ? 'bg-success-green' : 'bg-gray-400'}`}></div>
                      <span className={`text-xs font-medium ${activeIntegrations.length > 0 ? 'text-success-green' : 'text-gray-400'}`}>
                        {activeIntegrations.length > 0 ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                );
              })}
              
              <div className="mt-4">
                <Button 
                  onClick={() => setShowIntegrationModal(true)}
                  className="w-full bg-workmates-primary hover:bg-workmates-blue"
                >
                  <i className="fas fa-plus mr-2"></i>Add New Integration
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance & Risk Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-shield-alt text-workmates-primary mr-2"></i>
                Compliance Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">SOC 2 Type II</span>
                  <Badge className="bg-green-100 text-green-800">Certified</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">ISO 27001</span>
                  <Badge className="bg-green-100 text-green-800">Certified</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">GDPR</span>
                  <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">HIPAA</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Review Due</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Security Audit</span>
                  <Badge className="bg-blue-100 text-blue-800">Q2 2025</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-exclamation-triangle text-warning-amber mr-2"></i>
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium">Data Breach Risk</div>
                    <div className="text-xs text-text-secondary">Last assessed: 15 days ago</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Low</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium">Service Downtime</div>
                    <div className="text-xs text-text-secondary">Current uptime: 99.9%</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Low</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium">Integration Failure</div>
                    <div className="text-xs text-text-secondary">API health monitoring</div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium">Vendor Risk</div>
                    <div className="text-xs text-text-secondary">3rd party dependencies</div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* IntelliOps Service Capabilities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-server text-workmates-primary mr-2"></i>
                Server & Infrastructure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Windows/Linux User Creation</span>
                  <Badge className="bg-green-100 text-green-800">Automated</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>FTP/SFTP User Configuration</span>
                  <Badge className="bg-green-100 text-green-800">Auto</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>SSH Access Configuration</span>
                  <Badge className="bg-blue-100 text-blue-800">Assisted</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Server Patching (Win/Linux)</span>
                  <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Firewall Port Configuration</span>
                  <Badge className="bg-green-100 text-green-800">Auto</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Task Scheduler/Cron Jobs</span>
                  <Badge className="bg-green-100 text-green-800">Auto</Badge>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  347 tickets resolved this month
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Avg resolution: 12 mins
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-cloud text-workmates-primary mr-2"></i>
                AWS Cloud Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>IAM User/Policy Management</span>
                  <Badge className="bg-green-100 text-green-800">Auto</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>EC2/RDS Start/Stop</span>
                  <Badge className="bg-green-100 text-green-800">Scheduled</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Security Group Updates</span>
                  <Badge className="bg-green-100 text-green-800">Auto</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Route 53 DNS Management</span>
                  <Badge className="bg-blue-100 text-blue-800">Assisted</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>CloudWatch Alarms Setup</span>
                  <Badge className="bg-green-100 text-green-800">Auto</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Cost Optimization Reports</span>
                  <Badge className="bg-blue-100 text-blue-800">Weekly</Badge>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  289 tickets resolved this month
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Avg resolution: 8 mins
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-network-wired text-workmates-primary mr-2"></i>
                Network & Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Nginx/Apache Virtual Hosts</span>
                  <Badge className="bg-blue-100 text-blue-800">Assisted</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Pritunl VPN User Creation</span>
                  <Badge className="bg-green-100 text-green-800">Auto</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>ELB/Target Group Config</span>
                  <Badge className="bg-blue-100 text-blue-800">Assisted</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>504/502 Error Troubleshooting</span>
                  <Badge className="bg-yellow-100 text-yellow-800">L2 Escalation</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>TS Plus Client Issues</span>
                  <Badge className="bg-blue-100 text-blue-800">Assisted</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Printing Issues Resolution</span>
                  <Badge className="bg-green-100 text-green-800">Auto</Badge>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  156 tickets resolved this month
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Avg resolution: 22 mins
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Services & DevOps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-tools text-workmates-primary mr-2"></i>
                DevOps & CI/CD Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium mb-2">Development Operations</div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Jenkins Pipeline Creation</span>
                      <Badge variant="outline" className="text-xs">Auto</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Code Commit Repository</span>
                      <Badge variant="outline" className="text-xs">Auto</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Grafana Access Management</span>
                      <Badge variant="outline" className="text-xs">Auto</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>EKS Resource Access</span>
                      <Badge variant="outline" className="text-xs">Assisted</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Loki & Prometheus Setup</span>
                      <Badge variant="outline" className="text-xs">Assisted</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium mb-2">Container & Deployment</div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Service Deployment</span>
                      <Badge variant="outline" className="text-xs">Auto</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Pod Restart Requests</span>
                      <Badge variant="outline" className="text-xs">Auto</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>ECS/EKS Environment Vars</span>
                      <Badge variant="outline" className="text-xs">Auto</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Auto Scaling Adjustments</span>
                      <Badge variant="outline" className="text-xs">Auto</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Trend Micro Updates</span>
                      <Badge variant="outline" className="text-xs">Scheduled</Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Advanced Automation
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      CI/CD & Container Management
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      94%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Success Rate
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-shield-alt text-workmates-primary mr-2"></i>
                Security & Compliance Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">247</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Security Tasks</div>
                  </div>
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">89</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Compliance Checks</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Security Operations</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span>IAM Access Key Rotation</span>
                      <Badge className="bg-green-100 text-green-800">Auto</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>IP Whitelisting</span>
                      <Badge className="bg-green-100 text-green-800">Auto</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>S3 Bucket Access Control</span>
                      <Badge className="bg-blue-100 text-blue-800">Assisted</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>CloudWatch Log Analysis</span>
                      <Badge className="bg-blue-100 text-blue-800">Assisted</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Inactive User Cleanup</span>
                      <Badge className="bg-green-100 text-green-800">Scheduled</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Lambda Permission Issues</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Complex</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Intelligence & Account Onboarding and Escalation Trends & L1 Efficiency */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-analytics text-workmates-primary mr-2"></i>
                Business Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">247%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">ROI Growth</div>
                </div>
                <div className="text-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">18 mins</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Avg Response</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Contract Renewals</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-success-green h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Client Satisfaction</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-workmates-primary h-2 rounded-full" style={{width: '96%'}}></div>
                    </div>
                    <span className="text-sm font-medium">4.8★</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Service Uptime</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-success-green h-2 rounded-full" style={{width: '99.9%'}}></div>
                    </div>
                    <span className="text-sm font-medium">99.9%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Escalation Trends and L1 Efficiency */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-chart-line text-workmates-primary mr-2"></i>
                Monthly Escalation Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">87%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">L1 Resolution</div>
                    <div className="text-xs text-gray-900 dark:text-gray-100">↑ 3%</div>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">10%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">L2 Escalation</div>
                    <div className="text-xs text-gray-900 dark:text-gray-100">↓ 2%</div>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">3%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">L3 Escalation</div>
                    <div className="text-xs text-gray-900 dark:text-gray-100">↓ 1%</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Escalation Reasons</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-800 dark:text-gray-200">Network Infrastructure</span>
                      <Badge className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">L3 - 45%</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-800 dark:text-gray-200">Database Issues</span>
                      <Badge className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">L2 - 32%</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-800 dark:text-gray-200">Security Incidents</span>
                      <Badge className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">L3 - 38%</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-800 dark:text-gray-200">Application Errors</span>
                      <Badge className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">L2 - 68%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Impact Summary for Business */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <i className="fas fa-chart-bar text-workmates-primary mr-2"></i>
              IntelliOps Service Impact & Business Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Total Service Requests */}
              <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">1,247</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Service Requests</div>
                <div className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                  <div>• User Management: 347</div>
                  <div>• AWS Services: 289</div>
                  <div>• Network Config: 156</div>
                  <div>• DevOps Tasks: 208</div>
                  <div>• Security Ops: 247</div>
                </div>
              </div>

              {/* Monthly Operational Savings */}
              <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">62%</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Monthly Operational Savings</div>
                <div className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                  <div>• Manual Labor Reduction</div>
                  <div>• Faster Resolution Times</div>
                  <div>• Reduced Error Rates</div>
                  <div>• 24/7 Automated Coverage</div>
                </div>
              </div>

              {/* Fully Automated Resolution */}
              <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">67%</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Fully Automated Resolution</div>
                <div className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                  <div>• No Human Intervention</div>
                  <div>• Real-time Processing</div>
                  <div>• SLA Compliance</div>
                  <div>• Error-free Execution</div>
                </div>
              </div>

              {/* ROI Improvement */}
              <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">2.8x</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">ROI Improvement</div>
                <div className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                  <div>• vs Traditional L1 Support</div>
                  <div>• Scalable Operations</div>
                  <div>• Predictable Costs</div>
                  <div>• Quality Assurance</div>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-workmates-blue/10 to-workmates-orange/10 rounded-lg border border-workmates-primary/20">
              <div className="flex items-start space-x-3">
                <i className="fas fa-lightbulb text-workmates-primary mt-1"></i>
                <div>
                  <div className="font-medium text-workmates-primary mb-2">What IntelliOps Delivers for Your Business</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text-secondary">
                    <div>
                      <div className="font-medium mb-1">Infrastructure Management</div>
                      <div className="text-xs">Complete server lifecycle management, user provisioning, patching schedules, and security hardening across Windows and Linux environments.</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Cloud Operations</div>
                      <div className="text-xs">AWS resource management, cost optimization, security compliance, and automated scaling for enterprise cloud infrastructure.</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">DevOps Automation</div>
                      <div className="text-xs">CI/CD pipeline management, container orchestration, monitoring setup, and deployment automation for modern development workflows.</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Security & Compliance</div>
                      <div className="text-xs">Access control management, audit compliance, security monitoring, and incident response for enterprise security requirements.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export & Sharing Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <i className="fas fa-share-nodes text-workmates-primary mr-2"></i>
              Dashboard Sharing & Export
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button variant="outline" className="flex items-center justify-center p-4">
                <i className="fas fa-file-pdf text-error-red mr-2"></i>
                Export PDF Report
              </Button>
              <Button variant="outline" className="flex items-center justify-center p-4">
                <i className="fas fa-file-excel text-success-green mr-2"></i>
                Export Excel Data
              </Button>
              <Button variant="outline" className="flex items-center justify-center p-4">
                <i className="fas fa-link text-workmates-primary mr-2"></i>
                Share Dashboard Link
              </Button>
              <Button variant="outline" className="flex items-center justify-center p-4">
                <i className="fas fa-calendar text-warning-amber mr-2"></i>
                Schedule Reports
              </Button>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <i className="fas fa-info-circle text-workmates-primary mt-1"></i>
                <div>
                  <div className="font-medium text-sm">Business Sharing Features</div>
                  <div className="text-xs text-text-secondary mt-1">
                    Share real-time dashboard views with stakeholders, export comprehensive reports, 
                    and set up automated reporting schedules for executive teams and clients.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modals */}
        <IntegrationModal 
          isOpen={showIntegrationModal} 
          onClose={() => setShowIntegrationModal(false)} 
        />
        <OnboardingModal 
          isOpen={showOnboardingModal} 
          onClose={() => setShowOnboardingModal(false)} 
        />
      </div>
    </div>
  );
}
