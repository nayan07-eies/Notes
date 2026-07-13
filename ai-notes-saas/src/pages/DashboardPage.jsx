import React from 'react';
import { motion } from 'framer-motion';
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

// Refactored data for cleaner rendering and staggering
const statCards = [
  { title: "Total Documents", value: "45", icon: FileText, desc: "+20% from last month", trend: "emerald-500", showArrow: true },
  { title: "AI Insights Generated", value: "31", icon: Sparkles, iconColor: "text-primary", desc: "+12% from last month", trend: "emerald-500", showArrow: true },
  { title: "Storage Used", value: "142 MB", icon: HardDrive, desc: "2.1 GB remaining in plan", trend: "muted-foreground", showArrow: false },
  { title: "Today Token Remiand", value: "Healthy", valueColor: "text-emerald-500", icon: Activity, desc: "50 Token Remiand", trend: "muted-foreground", showArrow: false },
];

const activities = [
  { title: "Generated AI Summary", desc: 'For document "Project Architecture"', time: "2 hours ago", icon: Sparkles, color: "text-primary", bg: "bg-primary/10" },
  { title: "Created new document", desc: '"Q3 Marketing Strategy"', time: "5 hours ago", icon: FileText, color: "text-muted-foreground", bg: "bg-muted" },
  { title: "System Backup Completed", desc: "All workspaces synced to secure vault", time: "1 day ago", icon: HardDrive, color: "text-muted-foreground", bg: "bg-muted" },
];

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function DashboardPage() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pl-6 pt-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back! Here is your AI processing overview.</p>
      </motion.div>

      {/* Top Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, idx) => (
          <motion.div 
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/30 cursor-default"
          >
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">{stat.title}</h3>
              <stat.icon className={`h-4 w-4 transition-transform duration-300 group-hover:scale-125 ${stat.iconColor || 'text-muted-foreground'}`} />
            </div>
            <div className={`text-2xl font-bold ${stat.valueColor || ''}`}>{stat.value}</div>
            <p className={`text-xs mt-1 flex items-center text-${stat.trend}`}>
              {stat.showArrow && <ArrowUpRight className="h-3 w-3 mr-1" />} 
              {stat.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Main Chart & Activity Area */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Recharts Container */}
        <motion.div variants={itemVariants} className="col-span-4 rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col">
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Activity Overview</h3>
            <p className="text-sm text-muted-foreground">Document creation and AI generation over the last 7 days.</p>
          </div>
          <div className="h-[300px] w-full flex-1">
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
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div variants={itemVariants} className="col-span-3 rounded-xl border border-border bg-card shadow-sm p-6">
          <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-6">
            {activities.map((activity, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                className="group flex items-start gap-4 p-2 -mx-2 rounded-lg transition-colors hover:bg-muted/50"
              >
                <div className={`p-2 ${activity.bg} rounded-full ${activity.color} mt-0.5 transition-transform duration-300 group-hover:scale-110`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{activity.desc}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
      </div>
    </motion.div>
  );
}