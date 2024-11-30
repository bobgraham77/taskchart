import { PlusCircle, Clock, CheckCircle, Trash2 } from "lucide-react";
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
  onDeleteTask?: (taskId: number) => void;
  onToggleTask?: (taskId: number) => void;
}

export const PriorityColumn = ({ 
  priority, 
  tasks, 
  onAddTask, 
  onDeleteTask,
  onToggleTask 
}: PriorityColumnProps) => {
  const [showForm, setShowForm] = useState(false);

  const getBorderColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-[#00ff9d]";
      case "medium":
        return "border-[#00994d]";
      case "low":
        return "border-[#004d26]";
      default:
        return "border-[#00994d]";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-semibold capitalize text-gray-400">
          {priority} Priority
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-white/80 hover:text-white transition-colors ml-2"
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleTask?.(task.id)}
                    className={`transition-colors ${
                      task.status === "completed" 
                        ? "text-primary hover:text-primary/80" 
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {task.status === "completed" ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Clock className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => onDeleteTask?.(task.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};