import { PromoBanner } from "./home/_components/PromoBanner";
import { ClientHeader } from "./home/_components/ClientHeader";
import { Footer } from "./home/_components/Footer";
import AuthInterceptorsProvider from "@/providers/auth-interceptors-provider";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthInterceptorsProvider>
      <div className="min-h-screen bg-off-white flex flex-col">
        <PromoBanner />
        <ClientHeader />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </AuthInterceptorsProvider>
  );
}
