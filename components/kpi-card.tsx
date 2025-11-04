import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ArrowUpIcon = () => (
  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
)

const ArrowDownIcon = () => (
  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
)

interface KPICardProps {
  title: string
  value: string | number
  change?: number
  suffix?: string
  icon?: React.ReactNode
}

export function KPICard({ title, value, change, suffix, icon }: KPICardProps) {
  const isPositive = change && change > 0
  const isNegative = change && change < 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          {suffix && <span className="text-lg font-normal text-muted-foreground ml-1">{suffix}</span>}
        </div>
        {change !== undefined && (
          <div className="flex items-center text-xs mt-1">
            {isPositive && (
              <>
                <div className="text-green-600 mr-1">
                  <ArrowUpIcon />
                </div>
                <span className="text-green-600">+{change}%</span>
              </>
            )}
            {isNegative && (
              <>
                <div className="text-red-600 mr-1">
                  <ArrowDownIcon />
                </div>
                <span className="text-red-600">{change}%</span>
              </>
            )}
            {!isPositive && !isNegative && <span className="text-muted-foreground">No change</span>}
            <span className="text-muted-foreground ml-1">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
