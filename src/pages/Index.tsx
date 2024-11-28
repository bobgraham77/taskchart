import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { format, subDays, subMonths } from "date-fns";

const mockTasks = [
  { id: 1, title: "Review Q1 Report", priority: "high", status: "pending" },
  { id: 2, title: "Team Meeting", priority: "medium", status: "completed" },
  { id: 3, title: "Update Documentation", priority: "low", status: "pending" },
];

const generateDailyData = () => [
  { name: "9:00", completion: 65, task: "Review Q1 Report" },
  { name: "11:00", completion: 75, task: "Team Meeting" },
  { name: "13:00", completion: 85, task: "Update Documentation" },
  { name: "15:00", completion: 70, task: "Client Call" },
  { name: "17:00", completion: 90, task: "Code Review" },
  { name: "19:00", completion: 95, task: "Project Planning" },
  { name: "21:00", completion: 88, task: "Daily Summary" },
];

const generateWeeklyData = () => {
  return Array.from({ length: 7 }).map((_, index) => {
    const date = subDays(new Date(), 6 - index);
    return {
      name: format(date, "EEE"),
      fullDate: format(date, "PP"),
      completion: Math.floor(Math.random() * 30) + 65,
    };
  });
};

const generateMonthlyData = () => {
  return Array.from({ length: 30 }).map((_, index) => {
    const date = subDays(new Date(), 29 - index);
    return {
      name: format(date, "d"),
      fullDate: format(date, "PPPP"),
      completion: Math.floor(Math.random() * 30) + 65,
    };
  });
};

const generateYearlyData = () => {
  return Array.from({ length: 12 }).map((_, index) => {
    const date = subMonths(new Date(), 11 - index);
    return {
      name: format(date, "MMM"),
      completion: Math.floor(Math.random() * 30) + 65,
    };
  });
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      task?: string;
      fullDate?: string;
      name: string;
    };
  }>;
}

const Index = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  const data = useMemo(() => {
    switch (selectedPeriod) {
      case "day":
        return generateDailyData();
      case "week":
        return generateWeeklyData();
      case "month":
        return generateMonthlyData();
      case "year":
        return generateYearlyData();
      default:
        return generateWeeklyData();
    }
  }, [selectedPeriod]);

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (!active || !payload || !payload.length) return null;

    const value = payload[0].value;
    let label = "";

    switch (selectedPeriod) {
      case "day":
        label = payload[0].payload.task || "";
        break;
      case "week":
        label = payload[0].payload.fullDate || "";
        break;
      case "month":
        label = payload[0].payload.fullDate || "";
        break;
      case "year":
        label = payload[0].payload.name;
        break;
    }

    return (
      <div className="rounded-lg border border-border/50 bg-secondary/90 px-3 py-2 text-sm shadow-xl">
        <p className="font-medium text-white mb-1">{label}</p>
        <p className="text-gray-300">{value}% completed</p>
      </div>
    );
  };

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
                content={<CustomTooltip />}
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
