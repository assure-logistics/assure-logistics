import { useState } from "react";
import { Truck, Plus, Pencil, Trash2, Phone, Mail, User } from "lucide-react";
import {
  useListCarriers,
  useCreateCarrier,
  useUpdateCarrier,
  useDeleteCarrier,
  getListCarriersQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const carrierSchema = z.object({
  name: z.string().min(1, "Required"),
  code: z.string().min(1, "Required"),
  contactName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
});
type CarrierForm = z.infer<typeof carrierSchema>;

type CarrierItem = {
  id: number;
  name: string;
  code: string;
  contactName?: string | null;
  phone?: string | null;
  email?: string | null;
  activeShipments: number;
};

export default function Carriers() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [editCarrier, setEditCarrier] = useState<CarrierItem | null>(null);
  const [deleteCarrier, setDeleteCarrier] = useState<CarrierItem | null>(null);

  const { data: carriers, isLoading } = useListCarriers();
  const createCarrier = useCreateCarrier();
  const updateCarrier = useUpdateCarrier();
  const deleteCarrierMutation = useDeleteCarrier();

  const createForm = useForm<CarrierForm>({
    resolver: zodResolver(carrierSchema),
    defaultValues: { name: "", code: "", contactName: "", phone: "", email: "" },
  });

  const editForm = useForm<CarrierForm>({
    resolver: zodResolver(carrierSchema),
    defaultValues: { name: "", code: "", contactName: "", phone: "", email: "" },
  });

  function openEdit(carrier: CarrierItem) {
    setEditCarrier(carrier);
    editForm.reset({
      name: carrier.name,
      code: carrier.code,
      contactName: carrier.contactName ?? "",
      phone: carrier.phone ?? "",
      email: carrier.email ?? "",
    });
  }

  function onCreateSubmit(values: CarrierForm) {
    createCarrier.mutate(
      { data: { name: values.name, code: values.code, contactName: values.contactName || undefined, phone: values.phone || undefined, email: values.email || undefined } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCarriersQueryKey() });
          setShowCreate(false);
          createForm.reset();
          toast({ title: "Carrier created" });
        },
        onError: () => toast({ title: "Failed to create carrier", variant: "destructive" }),
      },
    );
  }

  function onEditSubmit(values: CarrierForm) {
    if (!editCarrier) return;
    updateCarrier.mutate(
      { id: editCarrier.id, data: { name: values.name, code: values.code, contactName: values.contactName || undefined, phone: values.phone || undefined, email: values.email || undefined } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCarriersQueryKey() });
          setEditCarrier(null);
          toast({ title: "Carrier updated" });
        },
        onError: () => toast({ title: "Failed to update carrier", variant: "destructive" }),
      },
    );
  }

  function onDelete() {
    if (!deleteCarrier) return;
    deleteCarrierMutation.mutate(
      { id: deleteCarrier.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCarriersQueryKey() });
          setDeleteCarrier(null);
          toast({ title: "Carrier removed" });
        },
        onError: () => toast({ title: "Failed to remove carrier", variant: "destructive" }),
      },
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Carriers</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Manage freight carrier partners</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)} data-testid="button-create-carrier">
          <Plus className="mr-1.5 h-4 w-4" /> Add Carrier
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-36" />)}
        </div>
      ) : carriers && carriers.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {carriers.map((carrier) => (
            <Card key={carrier.id} data-testid={`card-carrier-${carrier.id}`} className="group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="font-semibold truncate" data-testid={`text-carrier-name-${carrier.id}`}>{carrier.name}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-mono px-1.5 py-0">
                        {carrier.code}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {carrier.activeShipments} active {carrier.activeShipments === 1 ? "shipment" : "shipments"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(carrier)} data-testid={`button-edit-carrier-${carrier.id}`}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteCarrier(carrier)} data-testid={`button-delete-carrier-${carrier.id}`}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {(carrier.contactName || carrier.phone || carrier.email) && (
                  <div className="mt-3 space-y-1.5 border-t pt-3">
                    {carrier.contactName && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3 shrink-0" />
                        <span className="truncate">{carrier.contactName}</span>
                      </div>
                    )}
                    {carrier.phone && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3 shrink-0" />
                        <span>{carrier.phone}</span>
                      </div>
                    )}
                    {carrier.email && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3 shrink-0" />
                        <span className="truncate">{carrier.email}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Truck className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="font-medium">No carriers yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Add your first carrier partner to start creating shipments</p>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-sm" data-testid="dialog-create-carrier">
          <DialogHeader><DialogTitle>Add Carrier</DialogTitle></DialogHeader>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={createForm.control} name="name" render={({ field }) => (
                  <FormItem className="col-span-2"><FormLabel>Name</FormLabel><FormControl><Input placeholder="FastFreight Inc." {...field} data-testid="input-carrier-name" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={createForm.control} name="code" render={({ field }) => (
                  <FormItem><FormLabel>Code</FormLabel><FormControl><Input placeholder="FFI" {...field} data-testid="input-carrier-code" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={createForm.control} name="contactName" render={({ field }) => (
                  <FormItem><FormLabel>Contact</FormLabel><FormControl><Input placeholder="Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={createForm.control} name="phone" render={({ field }) => (
                  <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="+1-555-0000" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={createForm.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="ops@carrier.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button type="submit" disabled={createCarrier.isPending} data-testid="button-submit-carrier">
                  {createCarrier.isPending ? "Adding..." : "Add Carrier"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editCarrier} onOpenChange={(open) => !open && setEditCarrier(null)}>
        <DialogContent className="max-w-sm" data-testid="dialog-edit-carrier">
          <DialogHeader><DialogTitle>Edit Carrier</DialogTitle></DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={editForm.control} name="name" render={({ field }) => (
                  <FormItem className="col-span-2"><FormLabel>Name</FormLabel><FormControl><Input {...field} data-testid="input-edit-carrier-name" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={editForm.control} name="code" render={({ field }) => (
                  <FormItem><FormLabel>Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={editForm.control} name="contactName" render={({ field }) => (
                  <FormItem><FormLabel>Contact</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={editForm.control} name="phone" render={({ field }) => (
                  <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={editForm.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setEditCarrier(null)}>Cancel</Button>
                <Button type="submit" disabled={updateCarrier.isPending} data-testid="button-save-carrier">
                  {updateCarrier.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteCarrier} onOpenChange={(open) => !open && setDeleteCarrier(null)}>
        <AlertDialogContent data-testid="dialog-confirm-delete-carrier">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Carrier</AlertDialogTitle>
            <AlertDialogDescription>
              Remove <strong>{deleteCarrier?.name}</strong>? Shipments assigned to this carrier will be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" data-testid="button-confirm-delete-carrier">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
