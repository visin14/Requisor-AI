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
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Command Center</h1>
          <p className="text-white/50 font-mono text-sm uppercase tracking-widest">Pipeline intelligence and AI Copilot</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-none">
            <UserPlus className="w-4 h-4 mr-2" /> Add Candidate
          </Button>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-6 bg-white/[0.02] border-white/10 backdrop-blur-xl rounded-none">
          <h3 className="text-white/60 font-mono text-xs uppercase mb-6">Score Distribution</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="range" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="p-6 bg-white/[0.02] border-white/10 backdrop-blur-xl rounded-none">
          <h3 className="text-white/60 font-mono text-xs uppercase mb-6">Quality Trend (Last 5 Weeks)</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="week" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <Line type="monotone" dataKey="avgScore" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--accent))" }} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-primary/5 border-primary/20 backdrop-blur-xl rounded-none flex flex-col justify-center">
           <h3 className="text-white/60 font-mono text-xs uppercase mb-2">System Health</h3>
           <div className="flex items-center gap-4 mb-4">
             <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
             <span className="text-white font-medium">All Modules Online</span>
           </div>
           <div className="space-y-3">
             <div className="flex justify-between text-sm">
               <span className="text-white/50">Parsing Latency</span>
               <span className="text-white font-mono">1.2s</span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-white/50">Active Scans</span>
               <span className="text-white font-mono">42</span>
             </div>
           </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Pipeline Table */}
        <Card className="lg:col-span-2 p-0 bg-white/[0.02] border-white/10 backdrop-blur-xl rounded-none">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/40">
            <div className="flex gap-4 items-center w-2/3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <Input className="bg-white/5 border-white/10 text-white pl-10 h-9 text-sm rounded-none" placeholder="Search pipeline..." />
              </div>
              <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-white rounded-none">
                <Filter className="w-3 h-3 mr-2" /> Filters
              </Button>
            </div>
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10 rounded-none font-mono">
              97 Active
            </Badge>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-white/40 font-mono text-xs">ID</TableHead>
                  <TableHead className="text-white/40 font-mono text-xs">Candidate</TableHead>
                  <TableHead className="text-white/40 font-mono text-xs">AI Score</TableHead>
                  <TableHead className="text-white/40 font-mono text-xs">Status</TableHead>
                  <TableHead className="text-white/40 font-mono text-xs">Analysis Flags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((c) => (
                  <TableRow key={c.id} className="border-white/5 hover:bg-white/5 cursor-pointer transition-colors">
                    <TableCell className="font-mono text-xs text-white/30">{c.id}</TableCell>
                    <TableCell>
                      <div className="font-medium text-white">{c.name}</div>
                      <div className="text-xs text-white/50">{c.role}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 flex items-center justify-center font-mono font-bold text-xs border
                          ${c.score >= 90 ? 'border-primary/50 text-primary bg-primary/10' : 
                            c.score >= 70 ? 'border-blue-500/50 text-blue-400 bg-blue-500/10' : 
                            'border-white/10 text-white/50 bg-white/5'}`}
                        >
                          {c.score}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`rounded-none font-mono text-[10px] uppercase ${
                        c.score >= 90 ? 'border-primary/30 text-primary' : 
                        c.score >= 70 ? 'border-blue-500/30 text-blue-400' : 
                        'border-white/20 text-white/50'
                      }`}>
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {c.risk.includes('High') ? (
                        <div className="flex items-center gap-1 text-red-400 text-xs font-medium bg-red-500/10 px-2 py-1 inline-flex border border-red-500/20">
                          <AlertTriangle className="w-3 h-3" /> {c.risk}
                        </div>
                      ) : (
                        <span className="text-white/30 text-xs font-mono">CLEAN</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* AI Copilot */}
        <Card className="lg:col-span-1 p-0 bg-white/[0.02] border-white/10 backdrop-blur-xl flex flex-col h-[500px] rounded-none">
          <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-black/40">
            <div className="w-8 h-8 bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-white text-sm">Requisor Copilot</h3>
              <div className="text-[10px] text-primary font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-primary animate-pulse" /> SYNCED
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-6">
            <div className="flex flex-col gap-1 items-start">
              <div className="bg-white/5 border border-white/10 p-3 max-w-[90%] rounded-r-lg rounded-bl-lg">
                <p className="text-sm text-white/80 leading-relaxed">I analyzed Sarah Jenkins's profile. She's a 94% match for the Senior Frontend role, with exceptionally strong React architecture experience.</p>
              </div>
              <span className="text-[10px] text-white/30 font-mono ml-1">10:42 AM</span>
            </div>
            
            <div className="flex flex-col gap-1 items-end">
              <div className="bg-primary/20 border border-primary/30 p-3 max-w-[90%] rounded-l-lg rounded-tr-lg">
                <p className="text-sm text-white">Any skill gaps I should probe during the interview?</p>
              </div>
              <span className="text-[10px] text-white/30 font-mono mr-1">10:45 AM</span>
            </div>

            <div className="flex flex-col gap-1 items-start">
              <div className="bg-white/5 border border-white/10 p-3 max-w-[90%] rounded-r-lg rounded-bl-lg">
                <p className="text-sm text-white/80 leading-relaxed">Yes. Ask about her experience with WebGL or Three.js. Her resume heavily indexes on standard DOM manipulation, but this role requires heavy 3D rendering context.</p>
                <div className="mt-3 p-2 bg-black/40 border border-white/5 text-xs text-white/60 font-mono">
                  Suggested Question: "Describe a time you had to optimize render performance for a 3D scene."
                </div>
              </div>
              <span className="text-[10px] text-white/30 font-mono ml-1">10:45 AM</span>
            </div>
          </div>

          <div className="p-3 border-t border-white/5 bg-black/40">
            <div className="relative">
              <Input className="bg-white/5 border-white/10 text-white pr-10 rounded-none h-10 text-sm" placeholder="Query candidate data..." />
              <Button size="icon" variant="ghost" className="absolute right-0 top-0 h-10 w-10 text-white/50 hover:text-white rounded-none">
                <MessageSquare className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
