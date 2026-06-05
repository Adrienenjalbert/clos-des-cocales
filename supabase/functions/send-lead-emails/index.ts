// Edge Function: send-lead-emails
// Envoie :
//  1) Email de confirmation immédiate au prospect (brandé, mobile-first)
//  2) Notification immédiate à l'admin avec actions rapides
//  3) Email de relance "vos prochaines étapes" programmé à J+2 (Resend scheduled_at)
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "Le Clos des Cocales <onboarding@resend.dev>";
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") ?? "s1tjm65@gmail.com";
const SITE_URL = "https://clos-des-cocales.fr";
const PHONE_DISPLAY = "+33 6 83 42 13 66";
const PHONE_TEL = "+33683421366";
const WHATSAPP = "33683421366";

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

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

// Add UTM params to internal links for GA4 attribution
function utmUrl(path: string, campaign: string, content: string) {
  const sep = path.includes("?") ? "&" : "?";
  return `${SITE_URL}${path}${sep}utm_source=email&utm_medium=email&utm_campaign=${encodeURIComponent(campaign)}&utm_content=${encodeURIComponent(content)}`;
}

// ---------- Brand-styled wrapper (inline CSS, mobile-first, light bg) ----------
function shell(title: string, preheader: string, body: string) {
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<title>${esc(title)}</title>
</head>
<body style="margin:0;padding:0;background:#FAFAF7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:#FAFAF7;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAF7;">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 4px 24px rgba(26,29,36,0.08);">
      <tr><td style="background:#1A1D24;padding:24px 28px;">
        <div style="font-family:Georgia,'Times New Roman',serif;color:#FAFAF7;font-size:20px;letter-spacing:0.5px;">Le Clos des Cocales</div>
        <div style="color:#B89968;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-top:4px;">Espondeilhan · Hérault</div>
      </td></tr>
      <tr><td style="padding:32px 28px;line-height:1.6;font-size:16px;color:#1a1a1a;">
        ${body}
      </td></tr>
      <tr><td style="background:#FAFAF7;padding:20px 28px;text-align:center;font-size:12px;color:#6b6f72;line-height:1.5;">
        <a href="${SITE_URL}" style="color:#1A1D24;text-decoration:none;font-weight:600;">clos-des-cocales.fr</a>
        &nbsp;·&nbsp; <a href="tel:${PHONE_TEL}" style="color:#1A1D24;text-decoration:none;">${PHONE_DISPLAY}</a>
        <div style="margin-top:10px;">Vous recevez cet email suite à votre demande d'information sur notre site.</div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function btn(href: string, label: string, primary = true) {
  const bg = primary ? "#1A1D24" : "#ffffff";
  const color = primary ? "#FAFAF7" : "#1A1D24";
  const border = primary ? "#1A1D24" : "#1A1D24";
  return `<a href="${href}" style="display:inline-block;background:${bg};color:${color};border:1px solid ${border};text-decoration:none;padding:13px 22px;border-radius:999px;font-weight:600;font-size:14px;margin:4px 4px 4px 0;">${esc(label)}</a>`;
}

// ---------- 1. Confirmation immédiate (prospect) ----------
function confirmationHtml(lead: LeadPayload) {
  const first = esc(lead.name.split(" ")[0] || lead.name);
  const lotLine = lead.lot_interest
    ? `<p style="margin:0 0 16px;">Nous avons bien pris note de votre intérêt pour le <strong>lot ${esc(lead.lot_interest)}</strong>.</p>`
    : "";
  const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    `Bonjour, je viens de faire une demande${lead.lot_interest ? ` pour le lot ${lead.lot_interest}` : ""} sur votre site.`,
  )}`;
  const body = `
    <p style="margin:0 0 8px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#B89968;font-weight:600;">Demande reçue</p>
    <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.2;margin:0 0 18px;color:#1A1D24;font-weight:500;">
      Merci ${first}.
    </h1>
    <p style="margin:0 0 16px;">Votre demande concernant <strong>Le Clos des Cocales</strong> nous est bien parvenue.</p>
    ${lotLine}
    <p style="margin:0 0 20px;">Un conseiller vous recontacte sous <strong>24 h ouvrées</strong> avec la brochure complète, le plan de masse et les disponibilités à jour.</p>

    <div style="background:#FAFAF7;border-radius:14px;padding:18px 20px;margin:24px 0;">
      <div style="font-size:13px;text-transform:uppercase;letter-spacing:1.5px;color:#B89968;font-weight:600;margin-bottom:10px;">Les prochaines étapes</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:6px 0;font-size:15px;"><strong style="color:#1A1D24;">1.</strong> &nbsp;Échange téléphonique pour comprendre votre projet</td></tr>
        <tr><td style="padding:6px 0;font-size:15px;"><strong style="color:#1A1D24;">2.</strong> &nbsp;Envoi de la brochure, plan de masse et tarifs</td></tr>
        <tr><td style="padding:6px 0;font-size:15px;"><strong style="color:#1A1D24;">3.</strong> &nbsp;Visite sur place à Espondeilhan</td></tr>
      </table>
    </div>

    <p style="margin:0 0 8px;font-weight:600;">Besoin d'une réponse plus rapide ?</p>
    <div style="margin:8px 0 24px;">
      ${btn(`tel:${PHONE_TEL}`, `📞 ${PHONE_DISPLAY}`, true)}
      ${btn(waLink, "WhatsApp", false)}
    </div>

    <p style="margin:0 0 8px;font-weight:600;">En attendant, préparez votre projet :</p>
    <ul style="padding-left:18px;margin:0 0 20px;">
      <li style="margin-bottom:6px;"><a href="${utmUrl("/outils/simulateur-pret", "lead_confirmation", "simulateur")}" style="color:#1A1D24;">Simulateur de prêt immobilier</a></li>
      <li style="margin-bottom:6px;"><a href="${utmUrl("/outils/budget-total", "lead_confirmation", "budget")}" style="color:#1A1D24;">Budget total terrain + maison</a></li>
      <li style="margin-bottom:6px;"><a href="${utmUrl("/guide/acheter-terrain-a-batir", "lead_confirmation", "guide")}" style="color:#1A1D24;">Guide : acheter un terrain à bâtir</a></li>
      <li style="margin-bottom:6px;"><a href="${utmUrl("/brochure", "lead_confirmation", "brochure")}" style="color:#1A1D24;">Brochure complète du programme</a></li>
    </ul>

    <p style="margin:24px 0 0;color:#6b6f72;font-size:14px;">À très bientôt,<br/><strong style="color:#1A1D24;">L'équipe du Clos des Cocales</strong></p>
  `;
  return shell(
    "Merci pour votre demande — Le Clos des Cocales",
    `Bonjour ${first}, votre demande est bien reçue. Réponse sous 24 h ouvrées.`,
    body,
  );
}

// ---------- 2. Notification admin (avec actions rapides) ----------
function adminNotifHtml(lead: LeadPayload) {
  const waLink = `https://wa.me/${(lead.phone ?? "").replace(/\D/g, "") || WHATSAPP}`;
  const rows = [
    ["Nom", lead.name],
    ["Email", `<a href="mailto:${esc(lead.email)}" style="color:#1A1D24;">${esc(lead.email)}</a>`],
    lead.phone
      ? ["Téléphone", `<a href="tel:${esc(lead.phone)}" style="color:#1A1D24;">${esc(lead.phone)}</a>`]
      : null,
    lead.lot_interest ? ["Lot d'intérêt", esc(lead.lot_interest)] : null,
    lead.source ? ["Source", esc(lead.source)] : null,
    lead.message ? ["Message", esc(lead.message).replace(/\n/g, "<br/>")] : null,
  ].filter(Boolean) as [string, string][];

  const body = `
    <p style="margin:0 0 8px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#B89968;font-weight:600;">Nouveau lead</p>
    <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:24px;margin:0 0 18px;color:#1A1D24;font-weight:500;">
      ${esc(lead.name)}${lead.lot_interest ? ` — lot ${esc(lead.lot_interest)}` : ""}
    </h1>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee5d6;border-radius:12px;overflow:hidden;margin:16px 0 22px;">
      ${rows
        .map(
          ([k, v], i) => `
        <tr style="background:${i % 2 ? "#fbf8f1" : "#ffffff"};">
          <td style="padding:10px 14px;font-size:13px;color:#6b6f72;width:140px;vertical-align:top;">${k}</td>
          <td style="padding:10px 14px;font-size:14px;color:#1a1a1a;">${typeof v === "string" && (k === "Email" || k === "Téléphone" || k === "Message") ? v : esc(String(v))}</td>
        </tr>`,
        )
        .join("")}
    </table>

    <div style="margin:8px 0 4px;font-weight:600;">Actions rapides</div>
    <div>
      ${lead.phone ? btn(`tel:${esc(lead.phone)}`, "Appeler", true) : ""}
      ${lead.phone ? btn(waLink, "WhatsApp", false) : ""}
      ${btn(`mailto:${esc(lead.email)}`, "Répondre par email", false)}
    </div>

    <p style="margin:24px 0 0;color:#6b6f72;font-size:13px;">Lead reçu via ${esc(lead.source ?? "site")} · ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}</p>
  `;
  return shell("Nouveau lead — Le Clos des Cocales", `${lead.name} · ${lead.email}`, body);
}

// ---------- 3. Email de relance J+2 (séquence) ----------
function followUpHtml(lead: LeadPayload) {
  const first = esc(lead.name.split(" ")[0] || lead.name);
  const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    `Bonjour, je reviens vers vous au sujet du Clos des Cocales${lead.lot_interest ? ` (lot ${lead.lot_interest})` : ""}.`,
  )}`;
  const body = `
    <p style="margin:0 0 8px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#B89968;font-weight:600;">Suite à votre demande</p>
    <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.25;margin:0 0 16px;color:#1A1D24;font-weight:500;">
      ${first}, on continue votre projet ?
    </h1>
    <p style="margin:0 0 16px;">Nous voulions nous assurer que vous avez bien reçu nos premières informations sur <strong>Le Clos des Cocales</strong>${lead.lot_interest ? ` (lot ${esc(lead.lot_interest)})` : ""}.</p>
    <p style="margin:0 0 20px;">Si vous avez des questions sur les <strong>surfaces, les prix, le calendrier de viabilisation</strong> ou le <strong>financement</strong>, le plus efficace reste un échange direct :</p>

    <div style="margin:16px 0 26px;">
      ${btn(`tel:${PHONE_TEL}`, `📞 Appeler ${PHONE_DISPLAY}`, true)}
      ${btn(waLink, "WhatsApp", false)}
    </div>

    <div style="background:#FAFAF7;border-radius:14px;padding:18px 20px;margin:0 0 20px;">
      <div style="font-size:13px;text-transform:uppercase;letter-spacing:1.5px;color:#B89968;font-weight:600;margin-bottom:10px;">Ressources utiles</div>
      <ul style="padding-left:18px;margin:0;">
        <li style="margin-bottom:6px;"><a href="${SITE_URL}/outils/budget-total" style="color:#1A1D24;">Calculer votre budget total terrain + maison</a></li>
        <li style="margin-bottom:6px;"><a href="${SITE_URL}/outils/simulateur-pret" style="color:#1A1D24;">Simulateur de prêt</a></li>
        <li style="margin-bottom:6px;"><a href="${SITE_URL}/guide/acheter-terrain-a-batir" style="color:#1A1D24;">Guide pratique de l'achat de terrain</a></li>
        <li style="margin-bottom:6px;"><a href="${SITE_URL}/brochure" style="color:#1A1D24;">Brochure complète du programme</a></li>
      </ul>
    </div>

    <p style="margin:0 0 8px;">Une <strong>visite sur place à Espondeilhan</strong> reste le meilleur moyen de se projeter — il suffit de répondre à cet email pour caler un créneau.</p>

    <p style="margin:24px 0 0;color:#6b6f72;font-size:14px;">À très vite,<br/><strong style="color:#1A1D24;">L'équipe du Clos des Cocales</strong></p>
  `;
  return shell(
    `${first}, on continue votre projet au Clos des Cocales ?`,
    `Une visite sur place, un appel, ou des questions sur le financement ?`,
    body,
  );
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

    // J+2 (48 h) scheduling pour la relance — supporté nativement par Resend
    const followUpAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

    const [confirm, notif, followUp] = await Promise.allSettled([
      sendEmail({
        from: FROM_EMAIL,
        to: [lead.email],
        reply_to: ADMIN_EMAIL,
        subject: `Merci ${lead.name.split(" ")[0] || lead.name} — votre demande est bien reçue`,
        html: confirmationHtml(lead),
        tags: [{ name: "type", value: "lead_confirmation" }],
      }),
      sendEmail({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        reply_to: lead.email,
        subject: `🌿 Nouveau lead : ${lead.name}${lead.lot_interest ? ` — lot ${lead.lot_interest}` : ""}`,
        html: adminNotifHtml(lead),
        tags: [{ name: "type", value: "admin_notification" }],
      }),
      sendEmail({
        from: FROM_EMAIL,
        to: [lead.email],
        reply_to: ADMIN_EMAIL,
        subject: `${lead.name.split(" ")[0] || lead.name}, on continue votre projet ?`,
        html: followUpHtml(lead),
        scheduled_at: followUpAt,
        tags: [{ name: "type", value: "lead_follow_up_j2" }],
      }),
    ]);

    return new Response(
      JSON.stringify({
        confirmation: confirm.status,
        notification: notif.status,
        follow_up: followUp.status,
        scheduled_at: followUpAt,
        errors: [confirm, notif, followUp]
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
