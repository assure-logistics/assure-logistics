import { useParams, useLocation } from "wouter";
import { ArrowLeft, Package, Truck, MapPin, Calendar, Weight, Pencil, Trash2, Plus, Clock } from "lucide-react";
import {
  useGetShipment,
  useListShipmentEvents,
  useUpdateShipment,
  useDeleteShipment,
  useCreateShipmentEvent,
  useListCarriers,
  getGetShipmentQueryKey,
  getListShipmentEventsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const STATUS_OPTIONS = ["pending", "in_transit", "out_for_delivery", "delivered", "delayed", "cancelled"];

const editSchema = z.object({
  status: z.string().min(1),
  origin: z.string().min(1),
  destination: z.string().min(1),
  carrierId: z.coerce.number().min(1),
  estimatedDelivery: z.string().optional(),
  description: z.string().optional(),
});

const eventSchema = z.object({
  type: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  location: z.string().optional(),
});
type EventForm = z.infer<typeof eventSchema>;

export default function ShipmentDetail() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id, 10);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);

  const { data: shipment, isLoading } = useGetShipment(id, {
    query: { enabled: !!id, queryKey: getGetShipmentQueryKey(id) },
  });
  const { data: events, isLoading: eventsLoading } = useListShipmentEvents(id, {
    query: { enabled: !!id, queryKey: getListShipmentEventsQueryKey(id) },
  });
  const { data: carriers } = useListCarriers();
  const updateShipment = useUpdateShipment();
  const deleteShipment = useDeleteShipment();
  const createEvent = useCreateShipmentEvent();

  const editForm = useForm({
    resolver: zodResolver(editSchema),
    defaultValues: {
      status: shipment?.status ?? "pending",
      origin: shipment?.origin ?? "",
      destination: shipment?.destination ?? "",
      carrierId: shipment?.carrierId ?? 0,
      estimatedDelivery: shipment?.estimatedDelivery ?? "",
      description: shipment?.description ?? "",
    },
    values: shipment
      ? {
          status: shipment.status,
          origin: shipment.origin,
          destination: shipment.destination,
          carrierId: shipment.carrierId,
          estimatedDelivery: shipment.estimatedDelivery ?? "",
          description: shipment.description ?? "",
        }
      : undefined,
  });

  const eventForm = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: { type: "", description: "", location: "" },
  });

  function onEditSubmit(values: z.infer<typeof editSchema>) {
    updateShipment.mutate(
      { id, data: { ...values, carrierId: values.carrierId, description: values.description || undefined, estimatedDelivery: values.estimatedDelivery || undefined } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetShipmentQueryKey(id) });
          setShowEdit(false);
          toast({ title: "Shipment updated" });
        },
        onError: () => toast({ title: "Failed to update", variant: "destructive" }),
      },
    );
  }

  function onDelete() {
    deleteShipment.mutate(
      { id },
      {
        onSuccess: () => {
          toast({ title: "Shipment deleted" });
          setLocation("/shipments");
        },
        onError: () => toast({ title: "Failed to delete", variant: "destructive" }),
      },
    );
  }

  function onAddEvent(values: EventForm) {
    createEvent.mutate(
      { id, data: { type: values.type, description: values.description, location: values.location || undefined } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListShipmentEventsQueryKey(id) });
          setShowAddEvent(false);
          eventForm.reset();
          toast({ title: "Event added" });
        },
        onError: () => toast({ title: "Failed to add event", variant: "destructive" }),
      },
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Package className="h-12 w-12 text-muted-foreground/40 mb-4" />
        <h2 className="font-semibold text-lg">Shipment not found</h2>
        <p className="mt-1 text-sm text-muted-foreground">This shipment may have been deleted.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => setLocation("/shipments")}>
          Back to Shipments
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setLocation("/shipments")} data-testid="button-back">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-semibold font-mono tracking-tight">{shipment.trackingNumber}</h1>
            <StatusBadge status={shipment.status} />
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">{shipment.origin} → {shipment.destination}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => setShowEdit(true)} data-testid="button-edit-shipment">
            <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setShowDelete(true)} data-testid="button-delete-shipment">
            <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Shipment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Row icon={Package} label="Tracking" value={<span className="font-mono font-medium">{shipment.trackingNumber}</span>} />
            <Row icon={MapPin} label="Origin" value={shipment.origin} />
            <Row icon={MapPin} label="Destination" value={shipment.destination} />
            <Row icon={Truck} label="Carrier" value={shipment.carrierName ?? "—"} />
            {shipment.weight != null && <Row icon={Weight} label="Weight" value={`${shipment.weight} kg`} />}
            {shipment.estimatedDelivery && <Row icon={Calendar} label="Est. Delivery" value={shipment.estimatedDelivery} />}
            {shipment.description && <Row icon={Package} label="Description" value={shipment.description} />}
            <Row icon={Clock} label="Created" value={new Date(shipment.createdAt).toLocaleDateString()} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold">Event Timeline</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowAddEvent(true)} data-testid="button-add-event">
              <Plus className="mr-1 h-3.5 w-3.5" /> Add Event
            </Button>
          </CardHeader>
          <CardContent>
            {eventsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12" />)}
              </div>
            ) : events && events.length > 0 ? (
              <div className="relative pl-5">
                <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-4">
                  {events.map((event, idx) => (
                    <div key={event.id} className="relative" data-testid={`event-${event.id}`}>
                      <div className="absolute -left-3 mt-1 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary" />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                            {event.type.replace(/_/g, " ")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(event.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm">{event.description}</p>
                        {event.location && (
                          <p className="mt-0.5 text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-2.5 w-2.5" /> {event.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-8 text-center">
                <Clock className="h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">No events yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="max-w-md" data-testid="dialog-edit-shipment">
          <DialogHeader><DialogTitle>Edit Shipment</DialogTitle></DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField control={editForm.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger data-testid="select-status"><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={editForm.control} name="origin" render={({ field }) => (
                  <FormItem><FormLabel>Origin</FormLabel><FormControl><Input {...field} data-testid="input-edit-origin" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={editForm.control} name="destination" render={({ field }) => (
                  <FormItem><FormLabel>Destination</FormLabel><FormControl><Input {...field} data-testid="input-edit-destination" /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={editForm.control} name="carrierId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Carrier</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value?.toString()}>
                    <FormControl><SelectTrigger data-testid="select-edit-carrier"><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      {carriers?.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={editForm.control} name="estimatedDelivery" render={({ field }) => (
                <FormItem><FormLabel>Est. Delivery</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={editForm.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setShowEdit(false)}>Cancel</Button>
                <Button type="submit" disabled={updateShipment.isPending} data-testid="button-save-shipment">
                  {updateShipment.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Add Event Dialog */}
      <Dialog open={showAddEvent} onOpenChange={setShowAddEvent}>
        <DialogContent className="max-w-sm" data-testid="dialog-add-event">
          <DialogHeader><DialogTitle>Add Event</DialogTitle></DialogHeader>
          <Form {...eventForm}>
            <form onSubmit={eventForm.handleSubmit(onAddEvent)} className="space-y-4">
              <FormField control={eventForm.control} name="type" render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger data-testid="select-event-type"><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {["pickup", "in_transit", "checkpoint", "out_for_delivery", "delivered", "delay", "exception"].map(t => (
                        <SelectItem key={t} value={t}>{t.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={eventForm.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Input placeholder="What happened?" {...field} data-testid="input-event-description" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={eventForm.control} name="location" render={({ field }) => (
                <FormItem><FormLabel>Location (optional)</FormLabel><FormControl><Input placeholder="City, State" {...field} data-testid="input-event-location" /></FormControl><FormMessage /></FormItem>
              )} />
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setShowAddEvent(false)}>Cancel</Button>
                <Button type="submit" disabled={createEvent.isPending} data-testid="button-submit-event">
                  {createEvent.isPending ? "Adding..." : "Add Event"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent data-testid="dialog-confirm-delete">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Shipment</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{shipment.trackingNumber}</strong> and all its events. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" data-testid="button-confirm-delete">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  );
}
