import { useState } from "react";
import { PlusCircle } from "lucide-react";

interface TaskFormProps {
  onAddTask: (task: { title: string; priority: string }) => void;
  defaultPriority?: string;
}

export const TaskForm = ({ onAddTask, defaultPriority = "medium" }: TaskFormProps) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState(defaultPriority);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onAddTask({ title, priority });
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add new task..."
        className="flex-1 bg-transparent border-b border-gray-700 focus:border-primary outline-none px-2 py-1 text-gray-300"
      />
      {!defaultPriority && (
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="bg-transparent border-b border-gray-700 text-gray-300 outline-none"
        >
          <option value="low" className="bg-secondary">Low</option>
          <option value="medium" className="bg-secondary">Medium</option>
          <option value="high" className="bg-secondary">High</option>
        </select>
      )}
      <button
        type="submit"
        className="text-white hover:text-white/80 transition-colors"
      >
        <PlusCircle className="h-5 w-5" />
      </button>
    </form>
  );
};