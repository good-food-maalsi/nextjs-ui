import { PromoBanner } from "./home/_components/PromoBanner";
import { ClientHeader } from "./home/_components/ClientHeader";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-off-white">
      <PromoBanner />
      <ClientHeader />
      <main>{children}</main>
    </div>
  );
}
