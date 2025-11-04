import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const AlertTriangle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
)

const AlertCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const Info = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

interface Bottleneck {
  routeId: string
  routeName: string
  issueType: string
  severity: "high" | "medium" | "low"
  impact: string
}

interface BottleneckListProps {
  bottlenecks: Bottleneck[]
}

export function BottleneckList({ bottlenecks }: BottleneckListProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "medium":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getSeverityVariant = (severity: string): "default" | "destructive" => {
    return severity === "high" ? "destructive" : "default"
  }

  return (
    <div className="space-y-3">
      {bottlenecks.slice(0, 5).map((bottleneck, index) => (
        <Alert key={index} variant={getSeverityVariant(bottleneck.severity)}>
          {getSeverityIcon(bottleneck.severity)}
          <AlertTitle className="ml-2">
            {bottleneck.routeName} - {bottleneck.issueType}
          </AlertTitle>
          <AlertDescription className="ml-6">{bottleneck.impact}</AlertDescription>
        </Alert>
      ))}
    </div>
  )
}
