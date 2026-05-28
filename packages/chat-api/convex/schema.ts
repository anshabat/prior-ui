import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  contactSessions: defineTable({
    name: v.string(),
    email: v.string(),
    expiresAt: v.number(),
  }),
  conversations: defineTable({
    // track convex agent generated chat, ref to AI chatbot conversation, allow us to have human an AI chat as one
    threadId: v.string(),
    contactSessionId: v.id("contactSessions"),
    status: v.union(
      v.literal("unresolved"),
      v.literal("escalated"),
      v.literal("resolved"),
    ),
  })
    .index("by_thread_id", ["threadId"])
    .index("by_contact_session_id", ["contactSessionId"]),
});
