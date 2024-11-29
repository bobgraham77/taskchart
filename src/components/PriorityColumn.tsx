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

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold capitalize text-gray-400">
          {priority} Priority
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-primary hover:text-primary/80 transition-colors"
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