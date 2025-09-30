import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Zap, Target, Sparkles, Workflow, Calendar, BarChart3, Shield, Users, Cpu } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dotted Background Pattern */}
      <div className="absolute inset-0 bg-dot-pattern opacity-30" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/40 backdrop-blur-sm bg-background/80">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">Pythoughts</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#workflow" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Workflow</a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <Link to="/tasks">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Powered by intelligent automation</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Think Fast,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">
                Execute Faster
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The modern task management and automation platform that helps teams move from ideas to execution at the speed of thought.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/tasks">
                <Button size="lg" className="text-base px-8">
                  Get Started <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-base px-8">
                Watch Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section id="features" className="container mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to succeed</h2>
            <p className="text-muted-foreground text-lg">Powerful features designed for modern teams</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {/* Large Card - Analytics */}
            <Card className="md:col-span-2 lg:row-span-2 group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:scale-[1.02] border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Analytics</CardTitle>
                <CardDescription>Track user behavior and performance metrics in real-time</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <span className="font-semibold text-primary">94%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[94%] bg-gradient-to-r from-primary to-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medium Card - Dashboard */}
            <Card className="group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:scale-[1.02] border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                  <Target className="w-5 h-5 text-accent" />
                </div>
                <CardTitle>Dashboard</CardTitle>
                <CardDescription>Centralized data view</CardDescription>
              </CardHeader>
            </Card>

            {/* Medium Card - Teamwork */}
            <Card className="group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:scale-[1.02] border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <CardTitle>Collaboration</CardTitle>
                <CardDescription>Work together seamlessly</CardDescription>
              </CardHeader>
            </Card>

            {/* Large Horizontal Card - Efficiency */}
            <Card className="md:col-span-2 group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:scale-[1.02] border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Workflow className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Automation</CardTitle>
                <CardDescription>Streamline workflows with intelligent automation that learns from your patterns</CardDescription>
              </CardHeader>
            </Card>

            {/* Medium Card - Connectivity */}
            <Card className="group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:scale-[1.02] border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Cpu className="w-5 h-5 text-primary" />
                </div>
                <CardTitle>Integration</CardTitle>
                <CardDescription>Connect favorite tools</CardDescription>
              </CardHeader>
            </Card>

            {/* Medium Card - Calendar */}
            <Card className="group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:scale-[1.02] border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>Visual timeline view</CardDescription>
              </CardHeader>
            </Card>

            {/* Medium Card - Security */}
            <Card className="group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:scale-[1.02] border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <CardTitle>Security</CardTitle>
                <CardDescription>Enterprise-grade protection</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Workflow Section */}
        <section id="workflow" className="container mx-auto px-6 py-24 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">Built for your workflow</h2>
            <p className="text-muted-foreground text-lg">
              From simple tasks to complex automation, Pythoughts adapts to your team's unique needs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Lightning Fast</h3>
                <p className="text-muted-foreground">Execute tasks and workflows at incredible speeds with optimized performance.</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Precision Tools</h3>
                <p className="text-muted-foreground">Advanced filtering and search capabilities to find exactly what you need.</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Smart Automation</h3>
                <p className="text-muted-foreground">AI-powered workflows that learn and adapt to your team's patterns.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8 p-12 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to transform your workflow?</h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of teams already using Pythoughts to work smarter, not harder.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/tasks">
                <Button size="lg" className="text-base px-8">
                  Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-base px-8">
                Schedule Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Integrations</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Community</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
              <p>&copy; 2024 Pythoughts. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
