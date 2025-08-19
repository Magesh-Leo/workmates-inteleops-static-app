import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Platform } from "@shared/schema";

interface IntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IntegrationModal({ isOpen, onClose }: IntegrationModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    apiEndpoint: "",
    username: "",
    apiToken: "",
    autoAssign: true,
    priorityEscalation: true,
  });
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const { toast } = useToast();

  const { data: platforms = [] } = useQuery<Platform[]>({
    queryKey: ["/api/platforms"],
  });

  const createIntegrationMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create integration");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/metrics"] });
      toast({ title: "Integration created successfully" });
      handleClose();
    },
    onError: () => {
      toast({ title: "Failed to create integration", variant: "destructive" });
    },
  });

  const testConnectionMutation = useMutation({
    mutationFn: async () => {
      // For demo purposes, simulate connection test
      await new Promise(resolve => setTimeout(resolve, 1000));
      const success = Math.random() > 0.2;
      return { success, message: success ? "Connection successful" : "Connection failed: Invalid credentials" };
    },
    onSuccess: (result) => {
      setTestResult(result);
    },
  });

  const handleClose = () => {
    setSelectedPlatform("");
    setFormData({
      name: "",
      apiEndpoint: "",
      username: "",
      apiToken: "",
      autoAssign: true,
      priorityEscalation: true,
    });
    setTestResult(null);
    onClose();
  };

  const handleSubmit = () => {
    if (!selectedPlatform || !formData.name || !formData.apiEndpoint || !formData.apiToken) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    createIntegrationMutation.mutate({
      platformId: selectedPlatform,
      name: formData.name,
      apiEndpoint: formData.apiEndpoint,
      username: formData.username,
      apiToken: formData.apiToken,
      config: {
        autoAssign: formData.autoAssign,
        priorityEscalation: formData.priorityEscalation,
      },
      isActive: true,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Platform Integration Setup</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Platform Selection */}
          <div>
            <Label className="text-sm font-medium text-text-primary mb-3 block">Select Platform</Label>
            <div className="grid grid-cols-3 gap-4">
              {platforms.map((platform) => (
                <div
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedPlatform === platform.id
                      ? "border-enterprise-blue bg-blue-50"
                      : "border-neutral-border hover:bg-neutral-bg"
                  }`}
                >
                  <div className="text-center">
                    <i className={`${platform.icon} text-2xl mb-2`} style={{ color: platform.color }}></i>
                    <p className="text-sm font-medium">{platform.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* API Configuration */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-text-primary">API Configuration</h4>
            
            <div>
              <Label htmlFor="name">Integration Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Production Integration"
              />
            </div>
            
            <div>
              <Label htmlFor="endpoint">API Endpoint URL</Label>
              <Input
                id="endpoint"
                type="url"
                value={formData.apiEndpoint}
                onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                placeholder="https://your-instance.atlassian.net"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username/Email</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="user@company.com"
                />
              </div>
              <div>
                <Label htmlFor="token">API Token</Label>
                <Input
                  id="token"
                  type="password"
                  value={formData.apiToken}
                  onChange={(e) => setFormData({ ...formData, apiToken: e.target.value })}
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {/* Test Connection */}
            <div className="bg-neutral-bg p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-text-primary">Connection Test</span>
                <Button
                  onClick={() => testConnectionMutation.mutate()}
                  disabled={testConnectionMutation.isPending}
                  size="sm"
                >
                  {testConnectionMutation.isPending ? "Testing..." : "Test Connection"}
                </Button>
              </div>
              {testResult && (
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${testResult.success ? 'bg-success-green' : 'bg-error-red'}`}></div>
                  <span className={`text-sm ${testResult.success ? 'text-success-green' : 'text-error-red'}`}>
                    {testResult.message}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Automation Settings */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-text-primary">Automation Settings</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">Auto-assign tickets</p>
                  <p className="text-xs text-text-secondary">Automatically route L1 tickets to available agents</p>
                </div>
                <Switch
                  checked={formData.autoAssign}
                  onCheckedChange={(checked) => setFormData({ ...formData, autoAssign: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">Priority escalation</p>
                  <p className="text-xs text-text-secondary">Auto-escalate high priority tickets after 2 hours</p>
                </div>
                <Switch
                  checked={formData.priorityEscalation}
                  onCheckedChange={(checked) => setFormData({ ...formData, priorityEscalation: checked })}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createIntegrationMutation.isPending}
            className="bg-enterprise-blue hover:bg-blue-700"
          >
            {createIntegrationMutation.isPending ? "Creating..." : "Save Integration"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
