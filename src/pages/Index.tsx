import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { format, subDays, subMonths, startOfMonth, endOfMonth, eachWeekOfInterval } from "date-fns";
import { TaskChart } from "@/components/TaskChart";
import { PriorityColumn } from "@/components/PriorityColumn";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

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

  const handleAddTask = (newTask: { title: string; priority: string }) => {
    setTasks(prev => [...prev, { 
      id: prev.length + 1, 
      title: newTask.title, 
      priority: newTask.priority as "high" | "medium" | "low",
      status: "pending"
    }]);
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast({
      title: "Task deleted",
      description: "The task has been successfully removed",
    });
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
        <TaskChart data={data} selectedPeriod={selectedPeriod} />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {["high", "medium", "low"].map((priority) => (
          <PriorityColumn
            key={priority}
            priority={priority as "high" | "medium" | "low"}
            tasks={tasks}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
          />
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
