import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Automation() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Automation Rules</h1>
          <p className="text-text-secondary">Configure and manage ticket automation rules</p>
        </div>
        <Button className="bg-enterprise-blue hover:bg-blue-700">
          <i className="fas fa-plus mr-2"></i>Create Rule
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <i className="fas fa-robot text-4xl text-enterprise-blue mb-4"></i>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Automation Rules</h3>
            <p className="text-text-secondary">This feature is under development and will be available soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
