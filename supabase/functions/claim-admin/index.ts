// Edge Function: claim-admin
// Permet à l'utilisateur authentifié de devenir 'admin' UNIQUEMENT s'il n'existe
// encore aucun admin dans la base. Utilisé pour le bootstrap du premier compte.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "unauthenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Authentifier l'appelant via son JWT
    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Bloque si un admin existe déjà
    const { count, error: cntErr } = await admin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if (cntErr) throw cntErr;
    if ((count ?? 0) > 0) {
      // L'utilisateur courant est-il déjà admin ?
      const { data: mine } = await admin
        .from("user_roles")
        .select("id")
        .eq("user_id", userData.user.id)
        .eq("role", "admin")
        .maybeSingle();
      return new Response(
        JSON.stringify({
          claimed: false,
          already_admin: !!mine,
          reason: "admin_already_exists",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { error: insErr } = await admin.from("user_roles").insert({
      user_id: userData.user.id,
      role: "admin",
    });
    if (insErr) throw insErr;

    return new Response(JSON.stringify({ claimed: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
