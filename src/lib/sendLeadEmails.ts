import { supabase } from "@/integrations/supabase/client";

export interface LeadEmailPayload {
  name: string;
  email: string;
  phone?: string | null;
  lot_interest?: string | null;
  message?: string | null;
  source?: string;
}

/**
 * Déclenche l'envoi des emails (confirmation prospect + notification admin) via Resend.
 * Fire-and-forget : n'attend pas et n'interrompt jamais le flux UI en cas d'erreur.
 */
export function sendLeadEmails(payload: LeadEmailPayload) {
  void supabase.functions
    .invoke("send-lead-emails", {
      body: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone ?? undefined,
        lot_interest: payload.lot_interest ?? undefined,
        message: payload.message ?? undefined,
        source: payload.source,
      },
    })
    .catch((err) => {
      console.error("send-lead-emails invoke failed", err);
    });
}
