// Mock data generation for logistics network

export interface Delivery {
  id: string
  shipmentId: string
  origin: string
  destination: string
  distance: number
  deliveryTime: number
  cost: number
  status: "completed" | "in-transit" | "delayed"
  date: Date
  routeId: string
}

export interface Route {
  id: string
  name: string
  origin: string
  destination: string
  avgDistance: number
  avgTime: number
  avgCost: number
  utilizationRate: number
  deliveryCount: number
}

export interface Shipment {
  id: string
  weight: number
  volume: number
  priority: "high" | "medium" | "low"
  deliveryId: string
}

export interface CostBreakdown {
  routeId: string
  fuelCost: number
  laborCost: number
  maintenanceCost: number
  overheadCost: number
  totalCost: number
}

const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
  "Austin",
  "Jacksonville",
  "Fort Worth",
  "Columbus",
  "Charlotte",
]

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function randomCity(): string {
  return cities[Math.floor(Math.random() * cities.length)]
}

function generateRouteId(origin: string, destination: string): string {
  return `RT-${origin.substring(0, 3).toUpperCase()}-${destination.substring(0, 3).toUpperCase()}`
}

export function generateMockDeliveries(count = 500): Delivery[] {
  const deliveries: Delivery[] = []
  const startDate = new Date("2024-01-01")
  const endDate = new Date("2024-12-31")

  for (let i = 0; i < count; i++) {
    const origin = randomCity()
    let destination = randomCity()
    while (destination === origin) {
      destination = randomCity()
    }

    const distance = Math.floor(Math.random() * 2500) + 100
    const deliveryTime = Math.floor(distance / 50) + Math.random() * 10
    const baseCost = distance * 1.5 + Math.random() * 200
    const status = Math.random() > 0.85 ? "delayed" : Math.random() > 0.15 ? "completed" : "in-transit"

    deliveries.push({
      id: `DEL-${String(i + 1).padStart(5, "0")}`,
      shipmentId: `SHP-${String(i + 1).padStart(5, "0")}`,
      origin,
      destination,
      distance,
      deliveryTime,
      cost: baseCost,
      status,
      date: randomDate(startDate, endDate),
      routeId: generateRouteId(origin, destination),
    })
  }

  return deliveries.sort((a, b) => a.date.getTime() - b.date.getTime())
}

export function generateMockRoutes(deliveries: Delivery[]): Route[] {
  const routeMap = new Map<string, Delivery[]>()

  deliveries.forEach((delivery) => {
    if (!routeMap.has(delivery.routeId)) {
      routeMap.set(delivery.routeId, [])
    }
    routeMap.get(delivery.routeId)!.push(delivery)
  })

  const routes: Route[] = []
  routeMap.forEach((delivs, routeId) => {
    const completedDeliveries = delivs.filter((d) => d.status === "completed")
    const avgDistance = completedDeliveries.reduce((sum, d) => sum + d.distance, 0) / completedDeliveries.length
    const avgTime = completedDeliveries.reduce((sum, d) => sum + d.deliveryTime, 0) / completedDeliveries.length
    const avgCost = completedDeliveries.reduce((sum, d) => sum + d.cost, 0) / completedDeliveries.length
    const utilizationRate = (completedDeliveries.length / delivs.length) * 100

    routes.push({
      id: routeId,
      name: `${delivs[0].origin} to ${delivs[0].destination}`,
      origin: delivs[0].origin,
      destination: delivs[0].destination,
      avgDistance: Math.round(avgDistance),
      avgTime: Math.round(avgTime * 10) / 10,
      avgCost: Math.round(avgCost * 100) / 100,
      utilizationRate: Math.round(utilizationRate * 10) / 10,
      deliveryCount: delivs.length,
    })
  })

  return routes.sort((a, b) => b.deliveryCount - a.deliveryCount)
}

export function generateMockShipments(deliveries: Delivery[]): Shipment[] {
  return deliveries.map((delivery) => ({
    id: delivery.shipmentId,
    weight: Math.floor(Math.random() * 5000) + 100,
    volume: Math.floor(Math.random() * 100) + 10,
    priority: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low",
    deliveryId: delivery.id,
  }))
}

export function generateMockCosts(routes: Route[]): CostBreakdown[] {
  return routes.map((route) => {
    const fuelCost = route.avgDistance * 0.8
    const laborCost = route.avgTime * 25
    const maintenanceCost = route.avgDistance * 0.3
    const overheadCost = route.avgCost * 0.15

    return {
      routeId: route.id,
      fuelCost: Math.round(fuelCost * 100) / 100,
      laborCost: Math.round(laborCost * 100) / 100,
      maintenanceCost: Math.round(maintenanceCost * 100) / 100,
      overheadCost: Math.round(overheadCost * 100) / 100,
      totalCost: Math.round((fuelCost + laborCost + maintenanceCost + overheadCost) * 100) / 100,
    }
  })
}
