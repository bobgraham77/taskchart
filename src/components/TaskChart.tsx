import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

interface TaskChartProps {
  data: {
    name: string;
    completion: number;
    totalTasks: number;
    completedTasks: number;
  }[];
  themeColor: string;
}

export const TaskChart = ({ data, themeColor }: TaskChartProps) => {
  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (!active || !payload || !payload.length) return null;

    const value = payload[0].value;
    const { totalTasks, completedTasks } = payload[0].payload;

    return (
      <div className="rounded-lg border border-border/50 bg-secondary/90 px-3 py-2 text-sm shadow-xl">
        <p className="font-medium text-white mb-1">{payload[0].payload.name}</p>
        <p className="text-gray-300">{completedTasks}/{totalTasks} tâches</p>
        <p className="text-gray-300">{value.toFixed(1)}% complété</p>
      </div>
    );
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <defs>
            <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={themeColor} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={themeColor} stopOpacity={0}/>
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
            domain={[0, 100]}
          />
          <Tooltip 
            content={<CustomTooltip />}
          />
          <ReferenceLine 
            y={50} 
            stroke="#666" 
            strokeDasharray="3 3"
            strokeWidth={1}
          />
          <Area
            type="monotone"
            dataKey="completion"
            stroke={themeColor}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCompletion)"
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};