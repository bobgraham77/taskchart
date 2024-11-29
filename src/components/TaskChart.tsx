import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

interface TaskChartProps {
  data: any[];
  selectedPeriod: string;
}

export const TaskChart = ({ data, selectedPeriod }: TaskChartProps) => {
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

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};