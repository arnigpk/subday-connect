import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_leads",
  title: "List partner leads",
  description: "List partner application leads from the Subday partner portal, newest first. Optionally filter by status or city.",
  inputSchema: {
    status: z.string().trim().optional().describe("Filter by lead status (e.g. new, in_progress, done)."),
    city: z.string().trim().optional().describe("Filter by city (case-insensitive partial match)."),
    limit: z.number().int().min(1).max(100).optional().describe("Max number of leads to return (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status, city, limit }, ctx) => {
    if (!ctx.isAuthenticated()) throw new ToolError("Not authenticated");
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("partner_leads")
      .select("id,name,city,phone,venue,comment,status,note,created_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 20);
    if (status) query = query.eq("status", status);
    if (city) query = query.ilike("city", `%${city}%`);
    const { data, error } = await query;
    if (error) throw new ToolError(error.message);
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { leads: data ?? [], count: data?.length ?? 0 },
    };
  },
});
