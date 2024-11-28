import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

const data = [
  { name: "M", completion: 65 },
  { name: "T", completion: 75 },
  { name: "W", completion: 85 },
  { name: "T", completion: 70 },
  { name: "F", completion: 90 },
  { name: "S", completion: 95 },
  { name: "S", completion: 88 },
];

const mockTasks = [
  { id: 1, title: "Review Q1 Report", priority: "high", status: "pending" },
  { id: 2, title: "Team Meeting", priority: "medium", status: "completed" },
  { id: 3, title: "Update Documentation", priority: "low", status: "pending" },
];

const Index = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-7xl mx-auto dark">
      {/* Header */}
      <header className="mb-8 animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Task Dashboard
        </h1>
        <p className="text-gray-400">Track your productivity and tasks</p>
      </header>

      {/* Main Chart */}
      <Card className="p-4 mb-8 animate-slide-up bg-secondary/80">
        <div className="flex justify-end mb-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "day", label: "D" },
              { id: "week", label: "W" },
              { id: "month", label: "M" },
              { id: "year", label: "Y" },
            ].map(({ id, label }) => (
              <Button
                key={id}
                variant={selectedPeriod === id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(id)}
                className={`w-8 h-8 p-0 ${
                  selectedPeriod === id ? "" : "text-gray-500"
                }`}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <defs>
                <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0070F3" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0070F3" stopOpacity={0.1}/>
                </linearGradient>
                <filter id="glow" height="300%" width="300%" x="-100%" y="-100%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={false}
              />
              <YAxis 
                hide={true}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1F2C',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ color: '#fff' }}
                formatter={(value) => [`${value}%`, 'Completion']}
              />
              <Line
                type="monotone"
                dataKey="completion"
                stroke="#0070F3"
                strokeWidth={2}
                dot={false}
                fill="url(#colorCompletion)"
                filter="url(#glow)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Priority Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {["high", "medium", "low"].map((priority) => (
          <Card key={priority} className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold capitalize">
                {priority} Priority
              </h3>
              <Button size="icon" variant="ghost">
                <PlusCircle className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-3">
              {mockTasks
                .filter((task) => task.priority === priority)
                .map((task) => (
                  <div
                    key={task.id}
                    className={`card priority-${task.priority} animate-fade-in`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{task.title}</span>
                      {task.status === "completed" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Connect Notion CTA */}
      <Card className="p-6 text-center bg-gradient-to-r from-primary/5 to-primary/10">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h3 className="text-xl font-semibold mb-2">Connect with Notion</h3>
        <p className="text-gray-600 mb-4">
          Sync your tasks and boost your productivity
        </p>
        <Button>
          Connect Notion
        </Button>
      </Card>
    </div>
  );
};

export default Index;