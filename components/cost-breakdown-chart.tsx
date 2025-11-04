"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import type { CostBreakdown } from "@/lib/mock-data"

interface CostBreakdownChartProps {
  data: CostBreakdown[]
}

export function CostBreakdownChart({ data }: CostBreakdownChartProps) {
  const topRoutes = data.slice(0, 8).map((cost) => ({
    route: cost.routeId.replace("RT-", ""),
    Fuel: cost.fuelCost,
    Labor: cost.laborCost,
    Maintenance: cost.maintenanceCost,
    Overhead: cost.overheadCost,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Breakdown by Route</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topRoutes}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="route" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Legend />
            <Bar dataKey="Fuel" stackId="a" fill="hsl(var(--chart-1))" />
            <Bar dataKey="Labor" stackId="a" fill="hsl(var(--chart-2))" />
            <Bar dataKey="Maintenance" stackId="a" fill="hsl(var(--chart-3))" />
            <Bar dataKey="Overhead" stackId="a" fill="hsl(var(--chart-4))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
