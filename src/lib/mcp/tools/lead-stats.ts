import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "lead_stats",
  title: "Partner lead statistics",
  description: "Summarize partner leads: totals, counts by status, top cities, and leads in the last N days.",
  inputSchema: {
    days: z.number().int().min(1).max(365).optional().describe("Window in days for the recent-lead count (default 30)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ days }, ctx) => {
    if (!ctx.isAuthenticated()) throw new ToolError("Not authenticated");
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("partner_leads")
      .select("status,city,created_at");
    if (error) throw new ToolError(error.message);
    const rows = data ?? [];
    const window = days ?? 30;
    const since = Date.now() - window * 24 * 60 * 60 * 1000;
    const byStatus: Record<string, number> = {};
    const byCity: Record<string, number> = {};
    let recent = 0;
    for (const row of rows) {
      const status = row.status ?? "new";
      byStatus[status] = (byStatus[status] ?? 0) + 1;
      const city = (row.city ?? "").trim() || "—";
      byCity[city] = (byCity[city] ?? 0) + 1;
      if (row.created_at && new Date(row.created_at).getTime() >= since) recent += 1;
    }
    const topCities = Object.entries(byCity)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([city, count]) => ({ city, count }));
    const summary = { total: rows.length, byStatus, topCities, windowDays: window, recent };
    return {
      content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      structuredContent: summary,
    };
  },
});
