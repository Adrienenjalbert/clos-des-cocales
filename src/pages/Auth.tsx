import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { SEOHead } from "@/components/seo/SEOHead";

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin", { replace: true });
    });
  }, [navigate]);

  const bootstrapAdmin = async () => {
    try {
      await supabase.functions.invoke("claim-admin");
    } catch (e) {
      console.warn("claim-admin failed", e);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
      else {
        await bootstrapAdmin();
        navigate("/admin", { replace: true });
      }
    } else {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      if (error) toast.error(error.message);
      else if (data.session) {
        await bootstrapAdmin();
        toast.success("Compte créé.");
        navigate("/admin", { replace: true });
      } else {
        toast.success("Compte créé. Vérifiez votre email pour confirmer.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <div className="w-full max-w-md bg-background border border-border rounded-2xl p-8 shadow-soft">
        <h1 className="font-display text-2xl mb-1">Espace administrateur</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {mode === "login" ? "Connectez-vous pour gérer les lots." : "Créez votre compte admin."}
        </p>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <Button type="submit" disabled={loading} className="w-full h-11 rounded-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "login" ? "Se connecter" : "Créer mon compte"}
          </Button>
        </form>
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-4 text-sm text-muted-foreground hover:text-foreground w-full text-center"
        >
          {mode === "login" ? "Pas encore de compte ? Créer un compte" : "Déjà un compte ? Se connecter"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
