"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { RoutePerformance } from "@/lib/analytics"

interface RoutePerformanceTableProps {
  data: RoutePerformance[]
}

export function RoutePerformanceTable({ data }: RoutePerformanceTableProps) {
  const getEfficiencyBadge = (efficiency: number) => {
    if (efficiency >= 80) return <Badge className="bg-green-600">Excellent</Badge>
    if (efficiency >= 60) return <Badge className="bg-blue-600">Good</Badge>
    if (efficiency >= 40) return <Badge className="bg-yellow-600">Fair</Badge>
    return <Badge className="bg-red-600">Poor</Badge>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Route</TableHead>
            <TableHead>Efficiency</TableHead>
            <TableHead>Cost/Mile</TableHead>
            <TableHead>On-Time Rate</TableHead>
            <TableHead>Bottleneck Score</TableHead>
            <TableHead>Recommendation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.slice(0, 10).map((route) => (
            <TableRow key={route.routeId}>
              <TableCell className="font-medium">{route.routeName}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getEfficiencyBadge(route.efficiency)}
                  <span className="text-sm text-muted-foreground">{route.efficiency}%</span>
                </div>
              </TableCell>
              <TableCell>${route.costPerMile}</TableCell>
              <TableCell>{route.onTimeRate}%</TableCell>
              <TableCell>
                <span className={route.bottleneckScore > 20 ? "text-red-600 font-semibold" : ""}>
                  {route.bottleneckScore}%
                </span>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-xs">{route.recommendation}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
