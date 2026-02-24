import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { serverSession } from "@/lib/session/server-session";
import { SessionHydrater } from "@/lib/session/session-hydrater";
import AuthInterceptorsProvider from "@/providers/auth-interceptors-provider";

// La route est dynamique car elle utilise des cookies pour l'authentification
export const dynamic = "force-dynamic";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await serverSession.getServerSession();

  return (
    <AuthInterceptorsProvider>
      <SidebarProvider>
        <SessionHydrater session={session} />
        <AppSidebar session={session} />
        <SidebarInset className="flex h-screen flex-col overflow-hidden">
          <Header className="sticky top-0 z-50 bg-background" />
          <main className="flex-1 overflow-y-auto px-5 sm:px-10 py-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthInterceptorsProvider>
  );
}
