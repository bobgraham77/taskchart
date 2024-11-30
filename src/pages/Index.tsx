import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { TaskChart } from "@/components/TaskChart";
import { PriorityColumn } from "@/components/PriorityColumn";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: number;
  title: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "completed";
  timeOfDay: "Matin" | "Midi" | "Après-midi" | "Soir";
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  const dailyPerformance = useMemo(() => {
    const timeSlots = ["Matin", "Midi", "Après-midi", "Soir"];
    return timeSlots.map(slot => {
      const slotTasks = tasks.filter(task => task.timeOfDay === slot);
      const totalTasks = slotTasks.length;
      const completedTasks = slotTasks.filter(task => task.status === "completed").length;
      const completion = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
      
      return {
        name: slot,
        completion,
        totalTasks,
        completedTasks
      };
    });
  }, [tasks]);

  const dailyScore = useMemo(() => {
    const completedTasks = tasks.filter(task => task.status === "completed").length;
    return tasks.length === 0 ? 0 : (completedTasks / tasks.length) * 100;
  }, [tasks]);

  const themeColor = useMemo(() => {
    if (dailyScore >= 80) return "rgb(155, 135, 245)"; // excellent (violet)
    if (dailyScore >= 50) return "rgb(0, 255, 157)"; // good (green)
    if (dailyScore >= 30) return "rgb(249, 115, 22)"; // average (orange)
    return "rgb(239, 68, 68)"; // poor (red)
  }, [dailyScore]);

  const getPerformanceLabel = (score: number) => {
    if (score >= 80) return "Excellente";
    if (score >= 50) return "Bonne";
    if (score >= 30) return "Correcte";
    return "À améliorer";
  };

  const handleAddTask = (newTask: { title: string; priority: string; timeOfDay: "Matin" | "Midi" | "Après-midi" | "Soir" }) => {
    setTasks(prev => [...prev, { 
      id: prev.length + 1, 
      title: newTask.title, 
      priority: newTask.priority as "high" | "medium" | "low",
      status: "pending",
      timeOfDay: newTask.timeOfDay
    }]);
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast({
      title: "Task deleted",
      description: "The task has been successfully removed",
    });
  };

  const handleToggleTask = (taskId: number) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === "completed" ? "pending" : "completed" }
        : task
    ));
    toast({
      title: "Task status updated",
      description: "The task status has been successfully updated",
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-7xl mx-auto dark" style={{ "--primary-color": themeColor } as any}>
      <header className="mb-8 animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Task Dashboard
        </h1>
        <p className="text-gray-400">
          Performance journalière: <span style={{ color: themeColor }}>{getPerformanceLabel(dailyScore)}</span>
        </p>
      </header>

      <Card className="mb-8 animate-slide-up bg-secondary/20 border-0">
        <div className="flex justify-end mb-4 p-4">
          <div className="flex flex-wrap gap-2">
            {["day", "week", "month", "year"].map(period => (
              <button
                key={period}
                className={`w-8 h-8 rounded-md flex items-center justify-center text-gray-500 hover:bg-secondary/40`}
                style={{ color: themeColor }}
              >
                {period.charAt(0).toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <TaskChart data={dailyPerformance} themeColor={themeColor} />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {["high", "medium", "low"].map((priority) => (
          <PriorityColumn
            key={priority}
            priority={priority as "high" | "medium" | "low"}
            tasks={tasks}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onToggleTask={handleToggleTask}
          />
        ))}
      </div>

      <Card className="p-6 text-center bg-secondary/20 border-0">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4" style={{ color: themeColor }} />
        <h3 className="text-xl font-semibold mb-2 text-white">Connect with Notion</h3>
        <p className="text-gray-400 mb-4">
          Sync your tasks and boost your productivity
        </p>
      </Card>
    </div>
  );
};

export default Index;