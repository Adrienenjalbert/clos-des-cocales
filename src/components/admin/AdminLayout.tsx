import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, LayoutDashboard, MapPinned, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const NAV = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, end: true },
  { to: "/admin/lots", label: "Lots", icon: MapPinned },
  { to: "/admin/leads", label: "Leads", icon: Users },
];

const AdminSidebar = () => (
  <Sidebar collapsible="icon">
    <SidebarContent>
      <div className="px-4 py-5 border-b border-sidebar-border">
        <div className="font-display text-base text-sidebar-foreground">Le Clos des Cocales</div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-sidebar-foreground/60 mt-1">
          Cockpit
        </div>
      </div>
      <SidebarGroup>
        <SidebarGroupLabel>Pilotage</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {NAV.map((item) => (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-2 ${isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}`
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
);

const AdminLayout = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate("/auth", { replace: true });
      else setEmail(session.user.email ?? null);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate("/auth", { replace: true });
      else {
        setEmail(data.session.user.email ?? null);
        setChecking(false);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-secondary/30">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border bg-background px-3 md:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <div className="font-display text-sm md:text-base">Administration</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs text-muted-foreground">{email}</span>
              <Button variant="outline" size="sm" onClick={signOut} className="rounded-full">
                <LogOut className="w-4 h-4 mr-1.5" /> Déconnexion
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
