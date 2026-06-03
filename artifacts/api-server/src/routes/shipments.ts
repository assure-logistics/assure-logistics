import { Router, type IRouter } from "express";
import { eq, desc, sql, and, ilike, or } from "drizzle-orm";
import { db, shipmentsTable, carriersTable, shipmentEventsTable } from "@workspace/db";
import {
  ListShipmentsQueryParams,
  ListShipmentsResponse,
  CreateShipmentBody,
  GetShipmentParams,
  GetShipmentResponse,
  UpdateShipmentParams,
  UpdateShipmentBody,
  UpdateShipmentResponse,
  DeleteShipmentParams,
  ListRecentShipmentsResponse,
  ListShipmentEventsParams,
  ListShipmentEventsResponse,
  CreateShipmentEventParams,
  CreateShipmentEventBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function buildShipmentWithCarrier(s: typeof shipmentsTable.$inferSelect, carrierName: string | null) {
  return {
    ...s,
    carrierName: carrierName ?? null,
    weight: s.weight ?? null,
    description: s.description ?? null,
    estimatedDelivery: s.estimatedDelivery ?? null,
    updatedAt: s.updatedAt.toISOString(),
    createdAt: s.createdAt.toISOString(),
  };
}

router.get("/shipments/recent", async (_req, res): Promise<void> => {
  const rows = await db
    .select({ shipment: shipmentsTable, carrierName: carriersTable.name })
    .from(shipmentsTable)
    .leftJoin(carriersTable, eq(shipmentsTable.carrierId, carriersTable.id))
    .orderBy(desc(shipmentsTable.createdAt))
    .limit(10);

  res.json(
    ListRecentShipmentsResponse.parse(rows.map((r) => buildShipmentWithCarrier(r.shipment, r.carrierName ?? null))),
  );
});

router.get("/shipments", async (req, res): Promise<void> => {
  const qp = ListShipmentsQueryParams.safeParse(req.query);
  if (!qp.success) {
    res.status(400).json({ error: qp.error.message });
    return;
  }

  const { status, carrierId, search } = qp.data;

  const conditions = [];
  if (status) conditions.push(eq(shipmentsTable.status, status));
  if (carrierId) conditions.push(eq(shipmentsTable.carrierId, carrierId));
  if (search) {
    conditions.push(
      or(
        ilike(shipmentsTable.trackingNumber, `%${search}%`),
        ilike(shipmentsTable.origin, `%${search}%`),
        ilike(shipmentsTable.destination, `%${search}%`),
      ),
    );
  }

  const rows = await db
    .select({ shipment: shipmentsTable, carrierName: carriersTable.name })
    .from(shipmentsTable)
    .leftJoin(carriersTable, eq(shipmentsTable.carrierId, carriersTable.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(shipmentsTable.createdAt));

  res.json(
    ListShipmentsResponse.parse(rows.map((r) => buildShipmentWithCarrier(r.shipment, r.carrierName ?? null))),
  );
});

router.post("/shipments", async (req, res): Promise<void> => {
  const parsed = CreateShipmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { status, ...rest } = parsed.data;

  const [shipment] = await db
    .insert(shipmentsTable)
    .values({ ...rest, status: status ?? "pending" })
    .returning();

  const [carrier] = await db.select().from(carriersTable).where(eq(carriersTable.id, shipment.carrierId));

  res.status(201).json(GetShipmentResponse.parse(buildShipmentWithCarrier(shipment, carrier?.name ?? null)));
});

router.get("/shipments/:id", async (req, res): Promise<void> => {
  const params = GetShipmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .select({ shipment: shipmentsTable, carrierName: carriersTable.name })
    .from(shipmentsTable)
    .leftJoin(carriersTable, eq(shipmentsTable.carrierId, carriersTable.id))
    .where(eq(shipmentsTable.id, params.data.id));

  if (!row) {
    res.status(404).json({ error: "Shipment not found" });
    return;
  }

  res.json(GetShipmentResponse.parse(buildShipmentWithCarrier(row.shipment, row.carrierName ?? null)));
});

router.patch("/shipments/:id", async (req, res): Promise<void> => {
  const params = UpdateShipmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateShipmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [shipment] = await db
    .update(shipmentsTable)
    .set(parsed.data)
    .where(eq(shipmentsTable.id, params.data.id))
    .returning();

  if (!shipment) {
    res.status(404).json({ error: "Shipment not found" });
    return;
  }

  const [carrier] = await db.select().from(carriersTable).where(eq(carriersTable.id, shipment.carrierId));

  res.json(UpdateShipmentResponse.parse(buildShipmentWithCarrier(shipment, carrier?.name ?? null)));
});

router.delete("/shipments/:id", async (req, res): Promise<void> => {
  const params = DeleteShipmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [shipment] = await db.delete(shipmentsTable).where(eq(shipmentsTable.id, params.data.id)).returning();

  if (!shipment) {
    res.status(404).json({ error: "Shipment not found" });
    return;
  }

  res.sendStatus(204);
});

router.get("/shipments/:id/events", async (req, res): Promise<void> => {
  const params = ListShipmentEventsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const events = await db
    .select()
    .from(shipmentEventsTable)
    .where(eq(shipmentEventsTable.shipmentId, params.data.id))
    .orderBy(desc(shipmentEventsTable.createdAt));

  res.json(
    ListShipmentEventsResponse.parse(
      events.map((e) => ({
        ...e,
        location: e.location ?? null,
        createdAt: e.createdAt.toISOString(),
      })),
    ),
  );
});

router.post("/shipments/:id/events", async (req, res): Promise<void> => {
  const params = CreateShipmentEventParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = CreateShipmentEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [event] = await db
    .insert(shipmentEventsTable)
    .values({ ...parsed.data, shipmentId: params.data.id })
    .returning();

  res.status(201).json({
    ...event,
    location: event.location ?? null,
    createdAt: event.createdAt.toISOString(),
  });
});

export default router;
