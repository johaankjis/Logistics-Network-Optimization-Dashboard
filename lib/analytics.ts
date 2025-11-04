// Analytics and ETL functions for logistics optimization

import type { Delivery, Route, CostBreakdown } from "./mock-data"

export interface KPIMetrics {
  totalDeliveries: number
  onTimeDeliveryRate: number
  avgDeliveryTime: number
  totalCost: number
  avgCostPerDelivery: number
  totalDistance: number
  utilizationRate: number
}

export interface RoutePerformance {
  routeId: string
  routeName: string
  efficiency: number
  costPerMile: number
  onTimeRate: number
  bottleneckScore: number
  recommendation: string
}

export interface TrendData {
  month: string
  deliveries: number
  avgCost: number
  onTimeRate: number
}

export function calculateKPIs(deliveries: Delivery[]): KPIMetrics {
  const completedDeliveries = deliveries.filter((d) => d.status === "completed")
  const totalDeliveries = deliveries.length
  const onTimeDeliveries = completedDeliveries.filter((d) => d.deliveryTime <= d.distance / 50 + 5).length
  const onTimeDeliveryRate = (onTimeDeliveries / completedDeliveries.length) * 100

  const avgDeliveryTime = completedDeliveries.reduce((sum, d) => sum + d.deliveryTime, 0) / completedDeliveries.length
  const totalCost = deliveries.reduce((sum, d) => sum + d.cost, 0)
  const avgCostPerDelivery = totalCost / totalDeliveries
  const totalDistance = deliveries.reduce((sum, d) => sum + d.distance, 0)
  const utilizationRate = (completedDeliveries.length / totalDeliveries) * 100

  return {
    totalDeliveries,
    onTimeDeliveryRate: Math.round(onTimeDeliveryRate * 10) / 10,
    avgDeliveryTime: Math.round(avgDeliveryTime * 10) / 10,
    totalCost: Math.round(totalCost * 100) / 100,
    avgCostPerDelivery: Math.round(avgCostPerDelivery * 100) / 100,
    totalDistance: Math.round(totalDistance),
    utilizationRate: Math.round(utilizationRate * 10) / 10,
  }
}

export function analyzeRoutePerformance(
  routes: Route[],
  deliveries: Delivery[],
  costs: CostBreakdown[],
): RoutePerformance[] {
  return routes
    .map((route) => {
      const routeDeliveries = deliveries.filter((d) => d.routeId === route.id)
      const completedDeliveries = routeDeliveries.filter((d) => d.status === "completed")
      const routeCost = costs.find((c) => c.routeId === route.id)

      // Calculate efficiency (lower time per mile is better)
      const timePerMile = route.avgTime / route.avgDistance
      const efficiency = Math.max(0, 100 - timePerMile * 20)

      // Calculate cost per mile
      const costPerMile = route.avgCost / route.avgDistance

      // Calculate on-time rate
      const onTimeDeliveries = completedDeliveries.filter((d) => d.deliveryTime <= d.distance / 50 + 5).length
      const onTimeRate = (onTimeDeliveries / completedDeliveries.length) * 100

      // Calculate bottleneck score (higher means more problematic)
      const delayedCount = routeDeliveries.filter((d) => d.status === "delayed").length
      const bottleneckScore = (delayedCount / routeDeliveries.length) * 100

      // Generate recommendation
      let recommendation = "Optimal performance"
      if (bottleneckScore > 20) {
        recommendation = "High delay rate - investigate route conditions"
      } else if (costPerMile > 2.5) {
        recommendation = "High cost per mile - optimize fuel efficiency"
      } else if (onTimeRate < 80) {
        recommendation = "Low on-time rate - review scheduling"
      } else if (efficiency < 70) {
        recommendation = "Low efficiency - consider route alternatives"
      }

      return {
        routeId: route.id,
        routeName: route.name,
        efficiency: Math.round(efficiency * 10) / 10,
        costPerMile: Math.round(costPerMile * 100) / 100,
        onTimeRate: Math.round(onTimeRate * 10) / 10,
        bottleneckScore: Math.round(bottleneckScore * 10) / 10,
        recommendation,
      }
    })
    .sort((a, b) => b.efficiency - a.efficiency)
}

export function calculateTrends(deliveries: Delivery[]): TrendData[] {
  const monthlyData = new Map<string, Delivery[]>()

  deliveries.forEach((delivery) => {
    const monthKey = delivery.date.toLocaleDateString("en-US", { year: "numeric", month: "short" })
    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, [])
    }
    monthlyData.get(monthKey)!.push(delivery)
  })

  const trends: TrendData[] = []
  monthlyData.forEach((delivs, month) => {
    const completedDelivs = delivs.filter((d) => d.status === "completed")
    const onTimeDelivs = completedDelivs.filter((d) => d.deliveryTime <= d.distance / 50 + 5)
    const avgCost = delivs.reduce((sum, d) => sum + d.cost, 0) / delivs.length
    const onTimeRate = (onTimeDelivs.length / completedDelivs.length) * 100

    trends.push({
      month,
      deliveries: delivs.length,
      avgCost: Math.round(avgCost * 100) / 100,
      onTimeRate: Math.round(onTimeRate * 10) / 10,
    })
  })

  return trends
}

export function identifyBottlenecks(
  routes: Route[],
  deliveries: Delivery[],
): {
  routeId: string
  routeName: string
  issueType: string
  severity: "high" | "medium" | "low"
  impact: string
}[] {
  const bottlenecks: {
    routeId: string
    routeName: string
    issueType: string
    severity: "high" | "medium" | "low"
    impact: string
  }[] = []

  routes.forEach((route) => {
    const routeDeliveries = deliveries.filter((d) => d.routeId === route.id)
    const delayedCount = routeDeliveries.filter((d) => d.status === "delayed").length
    const delayRate = (delayedCount / routeDeliveries.length) * 100

    if (delayRate > 20) {
      bottlenecks.push({
        routeId: route.id,
        routeName: route.name,
        issueType: "High Delay Rate",
        severity: delayRate > 30 ? "high" : "medium",
        impact: `${delayRate.toFixed(1)}% of deliveries delayed`,
      })
    }

    if (route.avgCost / route.avgDistance > 2.5) {
      bottlenecks.push({
        routeId: route.id,
        routeName: route.name,
        issueType: "High Cost Per Mile",
        severity: route.avgCost / route.avgDistance > 3 ? "high" : "medium",
        impact: `$${(route.avgCost / route.avgDistance).toFixed(2)} per mile`,
      })
    }

    if (route.utilizationRate < 70) {
      bottlenecks.push({
        routeId: route.id,
        routeName: route.name,
        issueType: "Low Utilization",
        severity: route.utilizationRate < 60 ? "high" : "low",
        impact: `${route.utilizationRate.toFixed(1)}% utilization rate`,
      })
    }
  })

  return bottlenecks.sort((a, b) => {
    const severityOrder = { high: 3, medium: 2, low: 1 }
    return severityOrder[b.severity] - severityOrder[a.severity]
  })
}
