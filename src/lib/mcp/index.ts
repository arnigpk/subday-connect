import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listLeadsTool from "./tools/list-leads";
import getLeadTool from "./tools/get-lead";
import updateLeadTool from "./tools/update-lead";
import leadStatsTool from "./tools/lead-stats";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "subday-partner-portal",
  title: "Subday Partner Portal",
  version: "0.1.0",
  instructions:
    "Tools for the Subday partner portal. Use `list_leads` and `get_lead` to read partner applications, `update_lead` to set a lead's status or internal note, and `lead_stats` for aggregate numbers. All tools act as the signed-in Subday user.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listLeadsTool, getLeadTool, updateLeadTool, leadStatsTool],
});
