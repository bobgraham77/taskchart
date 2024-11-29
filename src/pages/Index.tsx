import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area } from "recharts";
import { Card } from "@/components/ui/card";
import { PlusCircle, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { format, subDays, subMonths, startOfMonth, endOfMonth, eachWeekOfInterval } from "date-fns";
import { TaskForm } from "@/components/TaskForm";

// Add the missing interface
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

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
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  
  // Get weeks of the current month
  const weeks = eachWeekOfInterval({ start, end });
  
  return weeks.map((weekStart, index) => {
    const weekEnd = subDays(weeks[index + 1] || end, 1);
    return {
      name: `Week ${index + 1}`,
      fullDate: `${format(weekStart, "d MMM")} - ${format(weekEnd, "d MMM")}`,
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

interface Task {
  id: number;
  title: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "completed";
}

const Index = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Review Q1 Report", priority: "high", status: "pending" },
    { id: 2, title: "Team Meeting", priority: "medium", status: "completed" },
    { id: 3, title: "Update Documentation", priority: "low", status: "pending" },
  ]);

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

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (!active || !payload || !payload.length) return null;

    const value = payload[0].value;
    let tooltipLabel = "";

    switch (selectedPeriod) {
      case "day":
        tooltipLabel = payload[0].payload.task || "";
        break;
      case "week":
        tooltipLabel = payload[0].payload.fullDate || "";
        break;
      case "month":
        tooltipLabel = payload[0].payload.fullDate || "";
        break;
      case "year":
        tooltipLabel = payload[0].payload.name;
        break;
    }

    return (
      <div className="rounded-lg border border-border/50 bg-secondary/90 px-3 py-2 text-sm shadow-xl">
        <p className="font-medium text-white mb-1">{tooltipLabel}</p>
        <p className="text-gray-300">{value}% completed</p>
      </div>
    );
  };

  const handleAddTask = (newTask: Task) => {
    setTasks(prev => [...prev, newTask]);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-7xl mx-auto dark">
      <header className="mb-8 animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Task Dashboard
        </h1>
        <p className="text-gray-400">Track your productivity and tasks</p>
      </header>

      <Card className="mb-8 animate-slide-up bg-secondary/20 border-0">
        <div className="flex justify-end mb-4 p-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "day", label: "D" },
              { id: "week", label: "W" },
              { id: "month", label: "M" },
              { id: "year", label: "Y" },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setSelectedPeriod(id)}
                className={`w-8 h-8 rounded-md flex items-center justify-center ${
                  selectedPeriod === id 
                    ? "bg-primary/20 text-primary" 
                    : "text-gray-500 hover:bg-secondary/40"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <defs>
                <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00ff9d" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#666' }}
              />
              <YAxis 
                hide={true}
              />
              <Tooltip 
                content={<CustomTooltip />}
              />
              <Area
                type="monotone"
                dataKey="completion"
                stroke="#00ff9d"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCompletion)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="mb-8">
        <TaskForm onAddTask={handleAddTask} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {["high", "medium", "low"].map((priority) => (
          <div key={priority} className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold capitalize text-gray-400">
                {priority} Priority
              </h3>
            </div>
            <div className="space-y-3">
              {tasks
                .filter((task) => task.priority === priority)
                .map((task) => (
                  <div
                    key={task.id}
                    className={`bg-secondary/20 rounded-lg p-4 border-l-2 ${
                      priority === "high" 
                        ? "border-red-500" 
                        : priority === "medium" 
                        ? "border-amber-500" 
                        : "border-emerald-500"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white">{task.title}</span>
                      {task.status === "completed" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <Card className="p-6 text-center bg-secondary/20 border-0">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h3 className="text-xl font-semibold mb-2 text-white">Connect with Notion</h3>
        <p className="text-gray-400 mb-4">
          Sync your tasks and boost your productivity
        </p>
      </Card>
    </div>
  );
};

export default Index;
