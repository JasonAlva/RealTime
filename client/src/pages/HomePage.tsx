
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            🚀 Now in Beta
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
            AI-Powered Real-Time
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Collaboration Platform
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Transform your workflow with intelligent real-time collaboration.
            Built for teams who demand speed, accuracy, and seamless
            integration.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" asChild>
              <Link to="/editor">Start Building</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[50%] top-0 ml-[-38rem] h-[25rem] w-[81.25rem] dark:[mask-image:linear-gradient(white,transparent)]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#36b49f] to-[#DBFF75] opacity-40 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-[#36b49f]/30 dark:to-[#DBFF75]/30 dark:opacity-100"></div>
          </div>
        </div>
      </section>

      {/* Features Grid - Bento Style */}
      <section className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
              Everything you need for modern collaboration
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Powerful features designed to supercharge your team's productivity
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
            {/* AI Assistant - Large Card */}
            <div className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-xl border p-6 hover:shadow-lg transition-all duration-300">
              <Card className="border-0 bg-transparent shadow-none h-full">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">AI</span>
                    </div>
                    <Badge variant="outline">New</Badge>
                  </div>
                  <CardTitle className="text-2xl">
                    AI-Powered Assistant
                  </CardTitle>
                  <CardDescription className="text-base">
                    Intelligent suggestions and real-time code completion
                    powered by advanced AI models
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Smart code suggestions
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Real-time error detection
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Context-aware completions
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Real-time Collaboration */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/50 dark:to-emerald-950/50 rounded-xl border p-6 hover:shadow-lg transition-all duration-300">
              <Card className="border-0 bg-transparent shadow-none h-full">
                <CardHeader>
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-white text-sm font-bold">⚡</span>
                  </div>
                  <CardTitle>Real-time Sync</CardTitle>
                  <CardDescription>
                    Collaborate with your team in real-time with instant updates
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Version Control */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950/50 dark:to-pink-950/50 rounded-xl border p-6 hover:shadow-lg transition-all duration-300">
              <Card className="border-0 bg-transparent shadow-none h-full">
                <CardHeader>
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-white text-sm font-bold">📝</span>
                  </div>
                  <CardTitle>Version Control</CardTitle>
                  <CardDescription>
                    Track changes and maintain history of all your work
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Analytics - Wide Card */}
            <div className="md:col-span-2 bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-950/50 dark:to-red-950/50 rounded-xl border p-6 hover:shadow-lg transition-all duration-300">
              <Card className="border-0 bg-transparent shadow-none h-full">
                <CardHeader>
                  <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-white text-sm font-bold">📊</span>
                  </div>
                  <CardTitle>Advanced Analytics</CardTitle>
                  <CardDescription>
                    Get insights into your team's productivity and project
                    progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-orange-600">
                        98%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Uptime
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">
                        2.5x
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Faster
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">
                        24/7
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Support
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Security */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-950/50 dark:to-slate-950/50 rounded-xl border p-6 hover:shadow-lg transition-all duration-300">
              <Card className="border-0 bg-transparent shadow-none h-full">
                <CardHeader>
                  <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-white text-sm font-bold">🔒</span>
                  </div>
                  <CardTitle>Enterprise Security</CardTitle>
                  <CardDescription>
                    Bank-level security with end-to-end encryption
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Integrations */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-cyan-950/50 dark:to-blue-950/50 rounded-xl border p-6 hover:shadow-lg transition-all duration-300">
              <Card className="border-0 bg-transparent shadow-none h-full">
                <CardHeader>
                  <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-white text-sm font-bold">🔗</span>
                  </div>
                  <CardTitle>100+ Integrations</CardTitle>
                  <CardDescription>
                    Connect with your favorite tools and services
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Ready to transform your workflow?
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Join thousands of teams already using RealTime to build faster and
            smarter.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" asChild>
              <Link to="/editor">Get Started Free</Link>
            </Button>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
