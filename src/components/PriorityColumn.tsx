import { PlusCircle, Clock, CheckCircle } from "lucide-react";
import { TaskForm } from "./TaskForm";
import { useState } from "react";

interface Task {
  id: number;
  title: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "completed";
}

interface PriorityColumnProps {
  priority: "high" | "medium" | "low";
  tasks: Task[];
  onAddTask: (task: { title: string; priority: string }) => void;
}

export const PriorityColumn = ({ priority, tasks, onAddTask }: PriorityColumnProps) => {
  const [showForm, setShowForm] = useState(false);

  const getBorderColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-[#00ff9d]"; // Bright/flashy green
      case "medium":
        return "border-[#00cc7d]"; // Normal green
      case "low":
        return "border-[#009b5f]"; // Faded green
      default:
        return "border-[#00cc7d]";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold capitalize text-gray-400">
          {priority} Priority
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-white hover:text-white/80 transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
        </button>
      </div>
      {showForm && (
        <TaskForm 
          onAddTask={(task) => {
            onAddTask({ ...task, priority });
            setShowForm(false);
          }}
          defaultPriority={priority}
        />
      )}
      <div className="space-y-3">
        {tasks
          .filter((task) => task.priority === priority)
          .map((task) => (
            <div
              key={task.id}
              className={`bg-secondary/20 rounded-lg p-4 border-l-2 ${getBorderColor(task.priority)}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-white">{task.title}</span>
                {task.status === "completed" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Clock className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};