import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    primaryContactName: "",
    contactEmail: "",
    contactPhone: "",
    expectedVolume: "",
    currentPlatforms: [] as string[],
    specialRequirements: "",
  });

  const { toast } = useToast();

  const platforms = [
    { id: "jira", name: "Jira", icon: "fab fa-jira" },
    { id: "servicenow", name: "ServiceNow", icon: "fas fa-mountain" },
    { id: "zoho", name: "Zoho", icon: "fas fa-z" },
  ];

  const createAccountMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/managed-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create account");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/managed-accounts"] });
      toast({ title: "Account created successfully" });
      handleClose();
    },
    onError: () => {
      toast({ title: "Failed to create account", variant: "destructive" });
    },
  });

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      companyName: "",
      industry: "",
      primaryContactName: "",
      contactEmail: "",
      contactPhone: "",
      expectedVolume: "",
      currentPlatforms: [],
      specialRequirements: "",
    });
    onClose();
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form
      createAccountMutation.mutate({
        ...formData,
        onboardingStatus: "in_progress",
        onboardingStep: 1,
      });
    }
  };

  const handlePlatformToggle = (platformId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      currentPlatforms: checked
        ? [...prev.currentPlatforms, platformId]
        : prev.currentPlatforms.filter(id => id !== platformId)
    }));
  };

  const progress = (currentStep / 4) * 100;

  const isStepValid = () => {
    if (currentStep === 1) {
      return formData.companyName && formData.primaryContactName && formData.contactEmail;
    }
    return true;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Managed Service Account Onboarding</DialogTitle>
          <p className="text-sm text-text-secondary">Step {currentStep} of 4: Client Information</p>
        </DialogHeader>
        
        {/* Progress Bar */}
        <div className="px-6 py-3 bg-neutral-bg rounded-lg">
          <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="company">Company Name *</Label>
                  <Input
                    id="company"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Acme Corporation"
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="financial">Financial Services</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="contact-name">Primary Contact Name *</Label>
                  <Input
                    id="contact-name"
                    value={formData.primaryContactName}
                    onChange={(e) => setFormData({ ...formData, primaryContactName: e.target.value })}
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-email">Contact Email *</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="john@acme.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="volume">Expected Ticket Volume/Month</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, expectedVolume: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select volume" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-100">1-100 tickets</SelectItem>
                      <SelectItem value="101-500">101-500 tickets</SelectItem>
                      <SelectItem value="501-1000">501-1000 tickets</SelectItem>
                      <SelectItem value="1000+">1000+ tickets</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-text-primary mb-3 block">Current Platforms in Use</Label>
                <div className="grid grid-cols-3 gap-4">
                  {platforms.map((platform) => (
                    <div key={platform.id} className="flex items-center p-3 border border-neutral-border rounded-lg">
                      <Checkbox
                        id={platform.id}
                        checked={formData.currentPlatforms.includes(platform.id)}
                        onCheckedChange={(checked) => handlePlatformToggle(platform.id, checked as boolean)}
                        className="mr-3"
                      />
                      <Label htmlFor={platform.id} className="flex items-center space-x-2 cursor-pointer">
                        <i className={platform.icon}></i>
                        <span className="text-sm">{platform.name}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="requirements">Special Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.specialRequirements}
                  onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                  rows={4}
                  placeholder="Please describe any specific automation requirements, SLA expectations, or compliance needs..."
                />
              </div>
            </div>
          )}

          {/* Additional steps would be implemented here */}
          {currentStep > 1 && (
            <div className="text-center py-8">
              <i className="fas fa-cog fa-spin text-4xl text-enterprise-blue mb-4"></i>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Step {currentStep} Implementation</h3>
              <p className="text-text-secondary">This step would contain the actual onboarding workflow for step {currentStep}.</p>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                Previous
              </Button>
            )}
            <Button variant="outline">Save Draft</Button>
            <Button
              onClick={handleNext}
              disabled={!isStepValid() || createAccountMutation.isPending}
              className="bg-enterprise-blue hover:bg-blue-700"
            >
              {currentStep === 4 
                ? (createAccountMutation.isPending ? "Creating..." : "Complete") 
                : "Next Step"
              }
              {currentStep < 4 && <i className="fas fa-arrow-right ml-2"></i>}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
