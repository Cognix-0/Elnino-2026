import { withSupabase } from "npm:@supabase/server"

export default {
  fetch: withSupabase({ auth: "user" }, async (_req, ctx) => {
    // ctx.supabase is initialized and scoped using the user's JWT
    const { data, error } = await ctx.supabase
      .from("profiles")
      .select("*")
      .limit(10)

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  }),
}
