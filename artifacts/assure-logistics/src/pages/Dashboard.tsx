import { Link } from "wouter";
import { Package, Truck, Clock, CheckCircle2, AlertTriangle, ArrowRight, MapPin } from "lucide-react";
import {
  useGetDashboardSummary,
  useListRecentShipments,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  loading,
}: {
  label: string;
  value: number | undefined;
  icon: React.ElementType;
  color: string;
  loading: boolean;
}) {
  return (
    <Card data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
            {loading ? (
              <Skeleton className="mt-1 h-8 w-16" />
            ) : (
              <p className="mt-1 text-3xl font-bold tabular-nums">{value ?? 0}</p>
            )}
          </div>
          <div className={`rounded-md p-2.5 ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary();
  const { data: recent, isLoading: recentLoading } = useListRecentShipments();
  // Ensure `recentList` is always an array to avoid runtime errors when the
  // response is unexpectedly not an array (defensive programming).
  const recentList = Array.isArray(recent) ? recent : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Operations Dashboard</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Live fleet status overview</p>
        </div>
        <Button asChild size="sm" data-testid="button-new-shipment">
          <Link href="/shipments">
            <Package className="mr-1.5 h-4 w-4" />
            New Shipment
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total" value={summary?.totalShipments} icon={Package} color="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" loading={summaryLoading} />
        <StatCard label="In Transit" value={summary?.inTransit} icon={Truck} color="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" loading={summaryLoading} />
        <StatCard label="Pending" value={summary?.pendingCount} icon={Clock} color="bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" loading={summaryLoading} />
        <StatCard label="Delivered" value={summary?.delivered} icon={CheckCircle2} color="bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400" loading={summaryLoading} />
        <StatCard label="Delayed" value={summary?.delayed} icon={AlertTriangle} color="bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400" loading={summaryLoading} />
        <StatCard label="Carriers" value={summary?.totalCarriers} icon={Truck} color="bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" loading={summaryLoading} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold">Recent Shipments</CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground">
              <Link href="/shipments">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {recentLoading ? (
              <div className="space-y-0 divide-y">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                ))}
              </div>
            ) : recentList.length > 0 ? (
              <div className="divide-y">
                {recentList.slice(0, 8).map((shipment) => (
                  <Link
                    key={shipment.id}
                    href={`/shipments/${shipment.id}`}
                    data-testid={`row-shipment-${shipment.id}`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <span className="font-mono text-xs font-medium text-primary w-28 shrink-0 truncate">
                      {shipment.trackingNumber}
                    </span>
                    <div className="flex flex-1 items-center gap-1.5 min-w-0 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{shipment.origin}</span>
                      <ArrowRight className="h-3 w-3 shrink-0" />
                      <span className="truncate">{shipment.destination}</span>
                    </div>
                    <StatusBadge status={shipment.status} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                No shipments yet. <Link href="/shipments" className="underline">Create one</Link>.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {summaryLoading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-8" />
                </div>
              ))
            ) : summary?.statusBreakdown && summary.statusBreakdown.length > 0 ? (
              summary.statusBreakdown
                .sort((a, b) => b.count - a.count)
                .map((item) => {
                  const pct = summary.totalShipments > 0 ? Math.round((item.count / summary.totalShipments) * 100) : 0;
                  return (
                    <div key={item.status} className="flex items-center gap-2" data-testid={`breakdown-${item.status}`}>
                      <StatusBadge status={item.status} />
                      <div className="flex-1 overflow-hidden rounded-full bg-muted h-1.5">
                        <div
                          className="h-full rounded-full bg-primary/30 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs tabular-nums text-muted-foreground w-6 text-right">{item.count}</span>
                    </div>
                  );
                })
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No data</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
