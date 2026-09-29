import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceRoleKey);

    const { data: existing } = await admin.auth.admin.listUsers();
    const already = existing?.users?.find(
      (u) => u.email === "admin@craftcart.shop"
    );

    if (already) {
      return new Response(
        JSON.stringify({ message: "Admin user already exists", id: already.id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data, error } = await admin.auth.admin.createUser({
      email: "admin@craftcart.shop",
      password: "CraftCart2025!",
      email_confirm: true,
    });

    if (error) throw error;

    await admin.from("admin_users").upsert({ email: "admin@craftcart.shop" });

    return new Response(
      JSON.stringify({ message: "Admin user created", id: data.user.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
