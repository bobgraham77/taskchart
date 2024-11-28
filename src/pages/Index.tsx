import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

const data = [
  { name: "Mon", completion: 65 },
  { name: "Tue", completion: 75 },
  { name: "Wed", completion: 85 },
  { name: "Thu", completion: 70 },
  { name: "Fri", completion: 90 },
  { name: "Sat", completion: 95 },
  { name: "Sun", completion: 88 },
];

const mockTasks = [
  { id: 1, title: "Review Q1 Report", priority: "high", status: "pending" },
  { id: 2, title: "Team Meeting", priority: "medium", status: "completed" },
  { id: 3, title: "Update Documentation", priority: "low", status: "pending" },
];

const Index = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-8 animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-bold text-secondary mb-2">
          Task Dashboard
        </h1>
        <p className="text-gray-600">Track your productivity and tasks</p>
      </header>

      {/* Main Chart */}
      <Card className="p-4 mb-8 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Completion Rate</h2>
          <div className="flex gap-2">
            {["day", "week", "month", "year"].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="capitalize"
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="completion"
                stroke="#0070F3"
                strokeWidth={2}
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