import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold gradient-text">
                Medical Cases Dashboard
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Query and analyze your medical cases with AI-powered insights
              </p>
            </div>
            <Badge variant="outline" className="text-medical-primary border-primary">
              Coming Soon
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
          <Card className="shadow-medical hover:shadow-medical-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Cases
              </CardTitle>
              <div className="text-2xl font-bold text-medical-primary">-</div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Available after implementation
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-medical hover:shadow-medical-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Recent Queries
              </CardTitle>
              <div className="text-2xl font-bold text-medical-secondary">-</div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Query history coming soon
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-medical hover:shadow-medical-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                AI Insights
              </CardTitle>
              <div className="text-2xl font-bold text-medical-success">-</div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Smart analytics pending
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Query Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-scale-in">
          <Card className="shadow-medical-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse-soft"></div>
                RAG-Based Query System
              </CardTitle>
              <CardDescription>
                Query cases using natural language with vector database retrieval
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
                <h4 className="font-semibold text-sm mb-2">Implementation Approach:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Vector embeddings of case documents</li>
                  <li>• Semantic search capabilities</li>
                  <li>• Context-aware responses</li>
                  <li>• Multi-modal content support</li>
                </ul>
              </div>
              <Button variant="outline" className="w-full" disabled>
                Start RAG Implementation
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-medical-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-2 w-2 bg-secondary rounded-full animate-pulse-soft"></div>
                SQL Agent Integration
              </CardTitle>
              <CardDescription>
                Direct database queries with intelligent SQL generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg border-l-4 border-secondary">
                <h4 className="font-semibold text-sm mb-2">Implementation Approach:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Natural language to SQL conversion</li>
                  <li>• Supabase integration</li>
                  <li>• Query optimization</li>
                  <li>• Real-time data access</li>
                </ul>
              </div>
              <Button variant="secondary" className="w-full" disabled>
                Start SQL Agent Setup
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Feature Preview */}
        <Card className="shadow-medical-lg animate-fade-in">
          <CardHeader>
            <CardTitle>Upcoming Features</CardTitle>
            <CardDescription>
              Planned enhancements for the medical cases dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <h4 className="font-semibold text-sm mb-2">🤖 AI Chat Interface</h4>
                <p className="text-xs text-muted-foreground">
                  Conversational AI for case analysis and recommendations
                </p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <h4 className="font-semibold text-sm mb-2">📊 Analytics Dashboard</h4>
                <p className="text-xs text-muted-foreground">
                  Visual insights and trends from case data
                </p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <h4 className="font-semibold text-sm mb-2">🔍 Advanced Search</h4>
                <p className="text-xs text-muted-foreground">
                  Powerful filtering and search capabilities
                </p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <h4 className="font-semibold text-sm mb-2">📋 Smart Reports</h4>
                <p className="text-xs text-muted-foreground">
                  Automated report generation with AI insights
                </p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <h4 className="font-semibold text-sm mb-2">🔗 Integration Hub</h4>
                <p className="text-xs text-muted-foreground">
                  Connect with external medical systems and APIs
                </p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <h4 className="font-semibold text-sm mb-2">📱 Mobile Access</h4>
                <p className="text-xs text-muted-foreground">
                  Responsive design for mobile case management
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Development Note */}
        <Card className="border-dashed border-2 border-muted-foreground/25 animate-fade-in">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-muted-foreground">
                🚧 Development in Progress
              </h3>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                This dashboard is currently under development. The RAG-based query system and SQL agent 
                integration are planned features that will enable powerful case analysis and data retrieval 
                capabilities. Stay tuned for updates!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}