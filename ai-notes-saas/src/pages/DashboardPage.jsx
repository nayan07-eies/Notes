import React from 'react';
import { FileText, Sparkles, HardDrive, Activity, ArrowUpRight } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Mock data for the activity chart
const chartData = [
  { name: 'Mon', notes: 4, ai: 2 },
  { name: 'Tue', notes: 7, ai: 5 },
  { name: 'Wed', notes: 5, ai: 3 },
  { name: 'Thu', notes: 12, ai: 10 },
  { name: 'Fri', notes: 8, ai: 6 },
  { name: 'Sat', notes: 3, ai: 1 },
  { name: 'Sun', notes: 6, ai: 4 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back! Here is your AI processing overview.</p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Documents</h3>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">45</div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center text-emerald-500">
            <ArrowUpRight className="h-3 w-3 mr-1" /> +20% from last month
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">AI Insights Generated</h3>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold">31</div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center text-emerald-500">
            <ArrowUpRight className="h-3 w-3 mr-1" /> +12% from last month
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Storage Used</h3>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">142 MB</div>
          <p className="text-xs text-muted-foreground mt-1">
            2.1 GB remaining in plan
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">System Status</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-emerald-500">Healthy</div>
          <p className="text-xs text-muted-foreground mt-1">
            All AI processing nodes online
          </p>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border border-border bg-card shadow-sm p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Activity Overview</h3>
            <p className="text-sm text-muted-foreground">Document creation and AI generation over the last 7 days.</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNotes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="notes" name="Documents Created" stroke="#8884d8" fillOpacity={1} fill="url(#colorNotes)" />
                <Area type="monotone" dataKey="ai" name="AI Generations" stroke="#82ca9d" fillOpacity={1} fill="url(#colorAi)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="col-span-3 rounded-xl border border-border bg-card shadow-sm p-6">
          <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-6">
            
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-full text-primary mt-0.5">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Generated AI Summary</p>
                <p className="text-xs text-muted-foreground mt-0.5">For document "Project Architecture"</p>
                <p className="text-xs text-muted-foreground/60 mt-1">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-muted rounded-full text-muted-foreground mt-0.5">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Created new document</p>
                <p className="text-xs text-muted-foreground mt-0.5">"Q3 Marketing Strategy"</p>
                <p className="text-xs text-muted-foreground/60 mt-1">5 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-muted rounded-full text-muted-foreground mt-0.5">
                <HardDrive className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">System Backup Completed</p>
                <p className="text-xs text-muted-foreground mt-0.5">All workspaces synced to secure vault</p>
                <p className="text-xs text-muted-foreground/60 mt-1">1 day ago</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}