"use client"

import { useState, useEffect } from "react"
import { PackageIcon, DollarSignIcon, ClockIcon, TruckIcon, AlertTriangleIcon } from "@/components/icons"
import { KPICard } from "@/components/kpi-card"
import { RoutePerformanceTable } from "@/components/route-performance-table"
import { BottleneckList } from "@/components/bottleneck-list"
import { TrendChart } from "@/components/trend-chart"
import { CostBreakdownChart } from "@/components/cost-breakdown-chart"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { generateMockDeliveries, generateMockRoutes, generateMockShipments, generateMockCosts } from "@/lib/mock-data"
import { calculateKPIs, analyzeRoutePerformance, calculateTrends, identifyBottlenecks } from "@/lib/analytics"

export default function LogisticsDashboard() {
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [data, setData] = useState(() => {
    const deliveries = generateMockDeliveries(500)
    const routes = generateMockRoutes(deliveries)
    const shipments = generateMockShipments(deliveries)
    const costs = generateMockCosts(routes)
    const kpis = calculateKPIs(deliveries)
    const routePerformance = analyzeRoutePerformance(routes, deliveries, costs)
    const trends = calculateTrends(deliveries)
    const bottlenecks = identifyBottlenecks(routes, deliveries)

    return { deliveries, routes, shipments, costs, kpis, routePerformance, trends, bottlenecks }
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const deliveries = generateMockDeliveries(500)
      const routes = generateMockRoutes(deliveries)
      const shipments = generateMockShipments(deliveries)
      const costs = generateMockCosts(routes)
      const kpis = calculateKPIs(deliveries)
      const routePerformance = analyzeRoutePerformance(routes, deliveries, costs)
      const trends = calculateTrends(deliveries)
      const bottlenecks = identifyBottlenecks(routes, deliveries)

      setData({ deliveries, routes, shipments, costs, kpis, routePerformance, trends, bottlenecks })
      setLastUpdate(new Date())
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const { deliveries, routes, shipments, costs, kpis, routePerformance, trends, bottlenecks } = data

  const handleExportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      kpis,
      routePerformance: routePerformance.slice(0, 10),
      bottlenecks: bottlenecks.slice(0, 5),
      summary: {
        totalRoutes: routes.length,
        criticalBottlenecks: bottlenecks.filter((b) => b.severity === "high").length,
        avgEfficiency: routePerformance.reduce((sum, r) => sum + r.efficiency, 0) / routePerformance.length,
      },
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `logistics-report-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Logistics Network Optimization</h1>
              <p className="text-muted-foreground mt-1">
                Real-time analytics and route performance monitoring • Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
            <Button onClick={handleExportReport}>Export Report</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="routes">Route Analysis</TabsTrigger>
            <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
            <TabsTrigger value="bottlenecks">Bottlenecks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <KPICard
                title="Total Deliveries"
                value={kpis.totalDeliveries.toLocaleString()}
                change={5.2}
                icon={<PackageIcon className="h-4 w-4" />}
              />
              <KPICard
                title="On-Time Delivery Rate"
                value={kpis.onTimeDeliveryRate}
                suffix="%"
                change={2.1}
                icon={<ClockIcon className="h-4 w-4" />}
              />
              <KPICard
                title="Avg Cost Per Delivery"
                value={`$${kpis.avgCostPerDelivery.toFixed(2)}`}
                change={-1.5}
                icon={<DollarSignIcon className="h-4 w-4" />}
              />
              <KPICard
                title="Fleet Utilization"
                value={kpis.utilizationRate}
                suffix="%"
                change={3.8}
                icon={<TruckIcon className="h-4 w-4" />}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <TrendChart data={trends} />
              <Card>
                <CardHeader>
                  <CardTitle>Network Summary</CardTitle>
                  <CardDescription>Key metrics at a glance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Distance Covered</span>
                    <span className="font-semibold">{kpis.totalDistance.toLocaleString()} miles</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Cost</span>
                    <span className="font-semibold">${kpis.totalCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Routes</span>
                    <span className="font-semibold">{routes.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg Delivery Time</span>
                    <span className="font-semibold">{kpis.avgDeliveryTime.toFixed(1)} hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Critical Bottlenecks</span>
                    <span className="font-semibold text-red-600">
                      {bottlenecks.filter((b) => b.severity === "high").length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="routes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Route Performance Analysis</CardTitle>
                <CardDescription>Detailed efficiency metrics and recommendations for all routes</CardDescription>
              </CardHeader>
              <CardContent>
                <RoutePerformanceTable data={routePerformance} />
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Performing Routes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {routePerformance.slice(0, 5).map((route, index) => (
                      <div key={route.routeId} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium">{route.routeName}</span>
                        </div>
                        <span className="text-sm text-green-600 font-semibold">{route.efficiency}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Most Cost-Efficient</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[...routePerformance]
                      .sort((a, b) => a.costPerMile - b.costPerMile)
                      .slice(0, 5)
                      .map((route, index) => (
                        <div key={route.routeId} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-chart-2 text-white text-xs font-bold">
                              {index + 1}
                            </div>
                            <span className="text-sm font-medium">{route.routeName}</span>
                          </div>
                          <span className="text-sm font-semibold">${route.costPerMile}/mi</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Needs Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[...routePerformance]
                      .sort((a, b) => a.efficiency - b.efficiency)
                      .slice(0, 5)
                      .map((route, index) => (
                        <div key={route.routeId} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertTriangleIcon className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm font-medium">{route.routeName}</span>
                          </div>
                          <span className="text-sm text-yellow-600 font-semibold">{route.efficiency}%</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="costs" className="space-y-6">
            <CostBreakdownChart data={costs} />

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cost Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(() => {
                      const totalFuel = costs.reduce((sum, c) => sum + c.fuelCost, 0)
                      const totalLabor = costs.reduce((sum, c) => sum + c.laborCost, 0)
                      const totalMaintenance = costs.reduce((sum, c) => sum + c.maintenanceCost, 0)
                      const totalOverhead = costs.reduce((sum, c) => sum + c.overheadCost, 0)
                      const grandTotal = totalFuel + totalLabor + totalMaintenance + totalOverhead

                      return (
                        <>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Fuel Costs</span>
                              <span className="text-sm font-semibold">
                                ${totalFuel.toLocaleString()} ({((totalFuel / grandTotal) * 100).toFixed(1)}%)
                              </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-chart-1"
                                style={{ width: `${(totalFuel / grandTotal) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Labor Costs</span>
                              <span className="text-sm font-semibold">
                                ${totalLabor.toLocaleString()} ({((totalLabor / grandTotal) * 100).toFixed(1)}%)
                              </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-chart-2"
                                style={{ width: `${(totalLabor / grandTotal) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Maintenance Costs</span>
                              <span className="text-sm font-semibold">
                                ${totalMaintenance.toLocaleString()} (
                                {((totalMaintenance / grandTotal) * 100).toFixed(1)}%)
                              </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-chart-3"
                                style={{ width: `${(totalMaintenance / grandTotal) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Overhead Costs</span>
                              <span className="text-sm font-semibold">
                                ${totalOverhead.toLocaleString()} ({((totalOverhead / grandTotal) * 100).toFixed(1)}%)
                              </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-chart-4"
                                style={{ width: `${(totalOverhead / grandTotal) * 100}%` }}
                              />
                            </div>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Highest Cost Routes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[...costs]
                      .sort((a, b) => b.totalCost - a.totalCost)
                      .slice(0, 8)
                      .map((cost) => (
                        <div key={cost.routeId} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{cost.routeId}</span>
                          <span className="text-sm font-semibold">${cost.totalCost.toLocaleString()}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bottlenecks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Identified Bottlenecks</CardTitle>
                <CardDescription>Critical issues affecting network performance</CardDescription>
              </CardHeader>
              <CardContent>
                <BottleneckList bottlenecks={bottlenecks} />
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-600" />
                    High Severity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{bottlenecks.filter((b) => b.severity === "high").length}</div>
                  <p className="text-sm text-muted-foreground mt-1">Require immediate attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-600" />
                    Medium Severity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{bottlenecks.filter((b) => b.severity === "medium").length}</div>
                  <p className="text-sm text-muted-foreground mt-1">Monitor and plan improvements</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-600" />
                    Low Severity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{bottlenecks.filter((b) => b.severity === "low").length}</div>
                  <p className="text-sm text-muted-foreground mt-1">Minor optimization opportunities</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
