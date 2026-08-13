import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "update_lead",
  title: "Update a partner lead",
  description: "Update the status and/or internal note of a partner lead.",
  inputSchema: {
    id: z.string().uuid().describe("Lead id (UUID)."),
    status: z.string().trim().min(1).optional().describe("New status, e.g. new, in_progress, done, rejected."),
    note: z.string().trim().max(2000).optional().describe("Internal note about this lead."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ id, status, note }, ctx) => {
    if (!ctx.isAuthenticated()) throw new ToolError("Not authenticated");
    if (status === undefined && note === undefined) throw new ToolError("Provide status and/or note to update.");
    const supabase = supabaseForUser(ctx);
    const patch: Record<string, string> = {};
    if (status !== undefined) patch.status = status;
    if (note !== undefined) patch.note = note;
    const { data, error } = await supabase
      .from("partner_leads")
      .update(patch)
      .eq("id", id)
      .select("id,name,status,note")
      .maybeSingle();
    if (error) throw new ToolError(error.message);
    if (!data) throw new ToolError("Lead not found or you do not have permission to update it.");
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { lead: data },
    };
  },
});
