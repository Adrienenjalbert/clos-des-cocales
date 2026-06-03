// Edge Function: send-lead-emails
// Envoie un email de confirmation au prospect + une notification à l'admin via Resend
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "Clos des Cocales <onboarding@resend.dev>";
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") ?? "s1tjm65@gmail.com";

interface LeadPayload {
  name: string;
  email: string;
  phone?: string;
  lot_interest?: string;
  message?: string;
  source?: string;
}

async function sendEmail(payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("Resend error", res.status, data);
    throw new Error(`Resend ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function confirmationHtml(lead: LeadPayload) {
  const name = escapeHtml(lead.name);
  return `<!doctype html><html><body style="font-family:Arial,sans-serif;background:#ffffff;color:#1a1a1a;padding:24px;">
    <div style="max-width:560px;margin:auto;">
      <h1 style="color:#6b3a2a;">Merci ${name}</h1>
      <p>Nous avons bien reçu votre demande concernant <strong>Le Clos des Cocales</strong>.</p>
      <p>Notre équipe vous recontacte sous 24h ouvrées pour échanger sur votre projet${
        lead.lot_interest ? ` (lot ${escapeHtml(lead.lot_interest)})` : ""
      }.</p>
      <p>À très bientôt,<br/>L'équipe du Clos des Cocales</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
      <p style="font-size:12px;color:#888;">Cet email vous a été envoyé suite à votre demande sur clos-des-cocales.fr</p>
    </div></body></html>`;
}

function adminNotifHtml(lead: LeadPayload) {
  return `<!doctype html><html><body style="font-family:Arial,sans-serif;padding:24px;">
    <h2>Nouveau lead — Clos des Cocales</h2>
    <table cellpadding="6" style="border-collapse:collapse;">
      <tr><td><strong>Nom</strong></td><td>${escapeHtml(lead.name)}</td></tr>
      <tr><td><strong>Email</strong></td><td>${escapeHtml(lead.email)}</td></tr>
      ${lead.phone ? `<tr><td><strong>Téléphone</strong></td><td>${escapeHtml(lead.phone)}</td></tr>` : ""}
      ${lead.lot_interest ? `<tr><td><strong>Lot</strong></td><td>${escapeHtml(lead.lot_interest)}</td></tr>` : ""}
      ${lead.source ? `<tr><td><strong>Source</strong></td><td>${escapeHtml(lead.source)}</td></tr>` : ""}
      ${lead.message ? `<tr><td valign="top"><strong>Message</strong></td><td>${escapeHtml(lead.message).replace(/\n/g, "<br/>")}</td></tr>` : ""}
    </table>
  </body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY missing");
    const lead = (await req.json()) as LeadPayload;
    if (!lead?.email || !lead?.name) {
      return new Response(JSON.stringify({ error: "name and email required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const [confirm, notif] = await Promise.allSettled([
      sendEmail({
        from: FROM_EMAIL,
        to: [lead.email],
        subject: "Votre demande — Le Clos des Cocales",
        html: confirmationHtml(lead),
      }),
      sendEmail({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        reply_to: lead.email,
        subject: `Nouveau lead : ${lead.name}${lead.lot_interest ? ` — lot ${lead.lot_interest}` : ""}`,
        html: adminNotifHtml(lead),
      }),
    ]);

    return new Response(
      JSON.stringify({
        confirmation: confirm.status,
        notification: notif.status,
        errors: [confirm, notif]
          .filter((r) => r.status === "rejected")
          .map((r) => (r as PromiseRejectedResult).reason?.message),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
