import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, MessageSquare, AlertTriangle, Sparkles, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart as RechartsLineChart, Line } from 'recharts';

export default function Recruiter() {
  const candidates = [
    { id: "C-1042", name: "Sarah Jenkins", role: "Senior Frontend", score: 94, status: "Strong Match", risk: "Low" },
    { id: "C-1043", name: "Michael Chen", role: "Backend Engineer", score: 88, status: "Match", risk: "Low" },
    { id: "C-1044", name: "Elena Rodriguez", role: "Product Manager", score: 72, status: "Needs Review", risk: "Med" },
    { id: "C-1045", name: "David Kim", role: "Senior Frontend", score: 45, status: "Rejected", risk: "High AI Gen" },
    { id: "C-1046", name: "Marcus Johnson", role: "DevOps Engineer", score: 81, status: "Match", risk: "Low" },
  ];

  const scoreData = [
    { range: '0-50', count: 12 },
    { range: '51-70', count: 25 },
    { range: '71-85', count: 42 },
    { range: '86-100', count: 18 },
  ];

  const trendData = [
    { week: 'W1', avgScore: 65 },
    { week: 'W2', avgScore: 68 },
    { week: 'W3', avgScore: 72 },
    { week: 'W4', avgScore: 75 },
    { week: 'W5', avgScore: 79 },
  ];

  return (
    <div className="container mx-auto px-6 py-12 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Command Center</h1>
          <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">Pipeline intelligence and AI Copilot</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-none shadow-[0_4px_14px_rgba(16,185,129,0.3)]">
            <UserPlus className="w-4 h-4 mr-2" /> Add Candidate
          </Button>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-none">
          <h3 className="text-muted-foreground font-mono text-xs uppercase mb-6">Score Distribution</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="range" stroke="rgba(0,0,0,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                <RechartsTooltip
                  cursor={{ fill: 'rgba(16,185,129,0.05)' }}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 4 }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-none">
          <h3 className="text-muted-foreground font-mono text-xs uppercase mb-6">Quality Trend (Last 5 Weeks)</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="week" stroke="rgba(0,0,0,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 4 }}
                />
                <Line type="monotone" dataKey="avgScore" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--accent))" }} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-primary/5 border border-primary/15 shadow-sm rounded-none flex flex-col justify-center">
          <h3 className="text-muted-foreground font-mono text-xs uppercase mb-2">System Health</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            <span className="text-gray-900 font-medium">All Modules Online</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Parsing Latency</span>
              <span className="text-gray-900 font-mono">1.2s</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Active Scans</span>
              <span className="text-gray-900 font-mono">42</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Pipeline Table */}
        <Card className="lg:col-span-2 p-0 bg-white border border-gray-100 shadow-sm rounded-none">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/60">
            <div className="flex gap-4 items-center w-2/3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input className="bg-white border-gray-200 pl-10 h-9 text-sm rounded-none" placeholder="Search pipeline..." />
              </div>
              <Button variant="outline" size="sm" className="border-gray-200 text-gray-600 rounded-none">
                <Filter className="w-3 h-3 mr-2" /> Filters
              </Button>
            </div>
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/8 rounded-none font-mono">
              97 Active
            </Badge>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100 hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-mono text-xs">ID</TableHead>
                  <TableHead className="text-muted-foreground font-mono text-xs">Candidate</TableHead>
                  <TableHead className="text-muted-foreground font-mono text-xs">AI Score</TableHead>
                  <TableHead className="text-muted-foreground font-mono text-xs">Status</TableHead>
                  <TableHead className="text-muted-foreground font-mono text-xs">Analysis Flags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((c) => (
                  <TableRow key={c.id} className="border-gray-50 hover:bg-primary/3 cursor-pointer transition-colors">
                    <TableCell className="font-mono text-xs text-muted-foreground">{c.id}</TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.role}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 flex items-center justify-center font-mono font-bold text-xs border
                          ${c.score >= 90 ? 'border-primary/40 text-primary bg-primary/8' :
                            c.score >= 70 ? 'border-accent/40 text-accent bg-accent/8' :
                            'border-gray-200 text-gray-400 bg-gray-50'}`}
                        >
                          {c.score}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`rounded-none font-mono text-[10px] uppercase ${
                        c.score >= 90 ? 'border-primary/30 text-primary bg-primary/5' :
                        c.score >= 70 ? 'border-accent/30 text-accent bg-accent/5' :
                        'border-gray-200 text-gray-400'
                      }`}>
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {c.risk.includes('High') ? (
                        <div className="flex items-center gap-1 text-red-500 text-xs font-medium bg-red-50 px-2 py-1 inline-flex border border-red-100">
                          <AlertTriangle className="w-3 h-3" /> {c.risk}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs font-mono">CLEAN</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* AI Copilot */}
        <Card className="lg:col-span-1 p-0 bg-white border border-gray-100 shadow-sm flex flex-col h-[500px] rounded-none">
          <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/60">
            <div className="w-8 h-8 bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm">Requisor Copilot</h3>
              <div className="text-[10px] text-primary font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse inline-block" /> SYNCED
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-6">
            <div className="flex flex-col gap-1 items-start">
              <div className="bg-gray-50 border border-gray-100 p-3 max-w-[90%] rounded-r-lg rounded-bl-lg">
                <p className="text-sm text-gray-700 leading-relaxed">I analyzed Sarah Jenkins's profile. She's a 94% match for the Senior Frontend role, with exceptionally strong React architecture experience.</p>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono ml-1">10:42 AM</span>
            </div>

            <div className="flex flex-col gap-1 items-end">
              <div className="bg-primary/10 border border-primary/20 p-3 max-w-[90%] rounded-l-lg rounded-tr-lg">
                <p className="text-sm text-gray-800">Any skill gaps I should probe during the interview?</p>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono mr-1">10:45 AM</span>
            </div>

            <div className="flex flex-col gap-1 items-start">
              <div className="bg-gray-50 border border-gray-100 p-3 max-w-[90%] rounded-r-lg rounded-bl-lg">
                <p className="text-sm text-gray-700 leading-relaxed">Yes. Ask about her experience with WebGL or Three.js. Her resume heavily indexes on standard DOM manipulation, but this role requires heavy 3D rendering context.</p>
                <div className="mt-3 p-2 bg-white border border-gray-100 text-xs text-gray-500 font-mono">
                  Suggested Question: "Describe a time you had to optimize render performance for a 3D scene."
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono ml-1">10:45 AM</span>
            </div>
          </div>

          <div className="p-3 border-t border-gray-100 bg-gray-50/60">
            <div className="relative">
              <Input className="bg-white border-gray-200 pr-10 rounded-none h-10 text-sm" placeholder="Query candidate data..." />
              <Button size="icon" variant="ghost" className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-primary rounded-none">
                <MessageSquare className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
