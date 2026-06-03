import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, carriersTable, shipmentsTable } from "@workspace/db";
import {
  CreateCarrierBody,
  UpdateCarrierBody,
  GetCarrierParams,
  GetCarrierResponse,
  UpdateCarrierParams,
  UpdateCarrierResponse,
  DeleteCarrierParams,
  ListCarriersResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/carriers", async (_req, res): Promise<void> => {
  const carriers = await db.select().from(carriersTable).orderBy(carriersTable.name);

  const activeCountRows = await db
    .select({ carrierId: shipmentsTable.carrierId, count: sql<number>`count(*)::int` })
    .from(shipmentsTable)
    .where(sql`${shipmentsTable.status} NOT IN ('delivered', 'cancelled')`)
    .groupBy(shipmentsTable.carrierId);

  const activeMap = new Map(activeCountRows.map((r) => [r.carrierId, r.count]));

  const result = carriers.map((c) => ({
    ...c,
    contactName: c.contactName ?? null,
    phone: c.phone ?? null,
    email: c.email ?? null,
    activeShipments: activeMap.get(c.id) ?? 0,
  }));

  res.json(ListCarriersResponse.parse(result));
});

router.post("/carriers", async (req, res): Promise<void> => {
  const parsed = CreateCarrierBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [carrier] = await db.insert(carriersTable).values(parsed.data).returning();

  res.status(201).json(
    GetCarrierResponse.parse({ ...carrier, contactName: carrier.contactName ?? null, phone: carrier.phone ?? null, email: carrier.email ?? null, activeShipments: 0 }),
  );
});

router.get("/carriers/:id", async (req, res): Promise<void> => {
  const params = GetCarrierParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [carrier] = await db.select().from(carriersTable).where(eq(carriersTable.id, params.data.id));

  if (!carrier) {
    res.status(404).json({ error: "Carrier not found" });
    return;
  }

  const [activeRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(shipmentsTable)
    .where(sql`${shipmentsTable.carrierId} = ${carrier.id} AND ${shipmentsTable.status} NOT IN ('delivered', 'cancelled')`);

  res.json(
    GetCarrierResponse.parse({
      ...carrier,
      contactName: carrier.contactName ?? null,
      phone: carrier.phone ?? null,
      email: carrier.email ?? null,
      activeShipments: activeRow?.count ?? 0,
    }),
  );
});

router.patch("/carriers/:id", async (req, res): Promise<void> => {
  const params = UpdateCarrierParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateCarrierBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [carrier] = await db
    .update(carriersTable)
    .set(parsed.data)
    .where(eq(carriersTable.id, params.data.id))
    .returning();

  if (!carrier) {
    res.status(404).json({ error: "Carrier not found" });
    return;
  }

  const [activeRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(shipmentsTable)
    .where(sql`${shipmentsTable.carrierId} = ${carrier.id} AND ${shipmentsTable.status} NOT IN ('delivered', 'cancelled')`);

  res.json(
    UpdateCarrierResponse.parse({
      ...carrier,
      contactName: carrier.contactName ?? null,
      phone: carrier.phone ?? null,
      email: carrier.email ?? null,
      activeShipments: activeRow?.count ?? 0,
    }),
  );
});

router.delete("/carriers/:id", async (req, res): Promise<void> => {
  const params = DeleteCarrierParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [carrier] = await db.delete(carriersTable).where(eq(carriersTable.id, params.data.id)).returning();

  if (!carrier) {
    res.status(404).json({ error: "Carrier not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
