import { useState } from "react";
import { Link } from "wouter";
import { Plus, Search, Package, ArrowRight } from "lucide-react";
import {
  useListShipments,
  useListCarriers,
  useCreateShipment,
  getListShipmentsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const STATUS_OPTIONS = ["all", "pending", "in_transit", "out_for_delivery", "delivered", "delayed", "cancelled"] as const;

const newShipmentSchema = z.object({
  trackingNumber: z.string().min(1, "Required"),
  origin: z.string().min(1, "Required"),
  destination: z.string().min(1, "Required"),
  carrierId: z.coerce.number().min(1, "Required"),
  weight: z.coerce.number().optional(),
  description: z.string().optional(),
  estimatedDelivery: z.string().optional(),
});
type NewShipmentForm = z.infer<typeof newShipmentSchema>;

export default function Shipments() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: shipments, isLoading } = useListShipments({
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });
  const { data: carriers } = useListCarriers();
  const createShipment = useCreateShipment();

  const form = useForm<NewShipmentForm>({
    resolver: zodResolver(newShipmentSchema),
    defaultValues: { trackingNumber: "", origin: "", destination: "", carrierId: 0, description: "", estimatedDelivery: "" },
  });

  function onSubmit(values: NewShipmentForm) {
    createShipment.mutate(
      {
        data: {
          trackingNumber: values.trackingNumber,
          origin: values.origin,
          destination: values.destination,
          carrierId: values.carrierId,
          weight: values.weight,
          description: values.description || undefined,
          estimatedDelivery: values.estimatedDelivery || undefined,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListShipmentsQueryKey() });
          setShowCreate(false);
          form.reset();
          toast({ title: "Shipment created" });
        },
        onError: () => {
          toast({ title: "Failed to create shipment", variant: "destructive" });
        },
      },
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Shipments</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Track and manage all freight</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)} data-testid="button-create-shipment">
          <Plus className="mr-1.5 h-4 w-4" /> New Shipment
        </Button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tracking, origin, destination..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="input-search"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44" data-testid="select-status-filter">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "all" ? "All statuses" : s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-20" />
                </div>
              ))}
            </div>
          ) : shipments && shipments.length > 0 ? (
            <div className="divide-y">
              <div className="grid grid-cols-[140px_1fr_140px_120px_120px] gap-4 px-5 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground border-b">
                <span>Tracking #</span>
                <span>Route</span>
                <span>Carrier</span>
                <span>Est. Delivery</span>
                <span>Status</span>
              </div>
              {shipments.map((shipment) => (
                <Link
                  key={shipment.id}
                  href={`/shipments/${shipment.id}`}
                  data-testid={`row-shipment-${shipment.id}`}
                  className="grid grid-cols-[140px_1fr_140px_120px_120px] gap-4 items-center px-5 py-3.5 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <span className="font-mono text-xs font-semibold text-primary truncate">
                    {shipment.trackingNumber}
                  </span>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground min-w-0">
                    <span className="truncate">{shipment.origin}</span>
                    <ArrowRight className="h-3 w-3 shrink-0" />
                    <span className="truncate">{shipment.destination}</span>
                  </div>
                  <span className="text-sm truncate">{shipment.carrierName ?? "—"}</span>
                  <span className="text-sm text-muted-foreground">{shipment.estimatedDelivery ?? "—"}</span>
                  <StatusBadge status={shipment.status} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="font-medium">No shipments found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {search || statusFilter !== "all" ? "Try adjusting your filters" : "Create your first shipment to get started"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg" data-testid="dialog-create-shipment">
          <DialogHeader>
            <DialogTitle>New Shipment</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="trackingNumber"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Tracking Number</FormLabel>
                      <FormControl>
                        <Input placeholder="FFI-2026-009" {...field} data-testid="input-tracking-number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origin</FormLabel>
                      <FormControl>
                        <Input placeholder="Chicago, IL" {...field} data-testid="input-origin" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination</FormLabel>
                      <FormControl>
                        <Input placeholder="New York, NY" {...field} data-testid="input-destination" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="carrierId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carrier</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger data-testid="select-carrier">
                            <SelectValue placeholder="Select carrier" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {carriers?.map((c) => (
                            <SelectItem key={c.id} value={c.id.toString()}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.0" {...field} data-testid="input-weight" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estimatedDelivery"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Est. Delivery</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-estimated-delivery" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Cargo description..." {...field} data-testid="input-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button type="submit" disabled={createShipment.isPending} data-testid="button-submit-shipment">
                  {createShipment.isPending ? "Creating..." : "Create Shipment"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
