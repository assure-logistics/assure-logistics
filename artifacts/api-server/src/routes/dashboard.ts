import { Router, type IRouter } from "express";
import { sql } from "drizzle-orm";
import { db, shipmentsTable, carriersTable } from "@workspace/db";
import { GetDashboardSummaryResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const [totals] = await db
    .select({
      totalShipments: sql<number>`count(*)::int`,
      inTransit: sql<number>`count(*) filter (where ${shipmentsTable.status} = 'in_transit')::int`,
      delivered: sql<number>`count(*) filter (where ${shipmentsTable.status} = 'delivered')::int`,
      delayed: sql<number>`count(*) filter (where ${shipmentsTable.status} = 'delayed')::int`,
      pendingCount: sql<number>`count(*) filter (where ${shipmentsTable.status} = 'pending')::int`,
    })
    .from(shipmentsTable);

  const [carrierCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(carriersTable);

  const statusBreakdown = await db
    .select({
      status: shipmentsTable.status,
      count: sql<number>`count(*)::int`,
    })
    .from(shipmentsTable)
    .groupBy(shipmentsTable.status);

  res.json(
    GetDashboardSummaryResponse.parse({
      totalShipments: totals?.totalShipments ?? 0,
      inTransit: totals?.inTransit ?? 0,
      delivered: totals?.delivered ?? 0,
      delayed: totals?.delayed ?? 0,
      pendingCount: totals?.pendingCount ?? 0,
      totalCarriers: carrierCount?.count ?? 0,
      statusBreakdown: statusBreakdown.map((r) => ({ status: r.status, count: r.count })),
    }),
  );
});

export default router;
