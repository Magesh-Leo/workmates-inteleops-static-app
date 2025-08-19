import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import IntegrationModal from "@/components/modals/integration-modal";
import type { Integration, Platform } from "@shared/schema";

export default function Integrations() {
  const [showModal, setShowModal] = useState(false);

  const { data: integrations = [], isLoading } = useQuery<Integration[]>({
    queryKey: ["/api/integrations"],
  });

  const { data: platforms = [] } = useQuery<Platform[]>({
    queryKey: ["/api/platforms"],
  });

  const getPlatformInfo = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform || { name: "Unknown", icon: "fas fa-question", color: "#6B7280" };
  };

  if (isLoading) {
    return <div>Loading integrations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">API Connections</h1>
          <p className="text-text-secondary">Manage platform integrations and API connections</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-enterprise-blue hover:bg-blue-700"
        >
          <i className="fas fa-plus mr-2"></i>Add Integration
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => {
          const platform = getPlatformInfo(integration.platformId);
          return (
            <Card key={integration.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className={platform.icon} style={{ color: platform.color }}></i>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <p className="text-sm text-text-secondary">{platform.name}</p>
                  </div>
                </div>
                <Badge className={integration.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                  {integration.isActive ? "Active" : "Inactive"}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-text-secondary">Endpoint</p>
                    <p className="text-sm text-text-primary truncate">{integration.apiEndpoint}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Last Sync</p>
                    <p className="text-sm text-text-primary">
                      {integration.lastSync 
                        ? new Date(integration.lastSync).toLocaleString()
                        : "Never"
                      }
                    </p>
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <i className="fas fa-cog mr-2"></i>Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      <i className="fas fa-sync"></i>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <IntegrationModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </div>
  );
}
