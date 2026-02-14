import { serverSession } from "@/lib/session/server-session";
import { currentFranchiseService } from "@/services/current-franchise.service";

interface SearchParams {
  selectedRange?: "day" | "week" | "month" | "trimester" | "year";
}

export default async function Dashboard(props: {
  searchParams: Promise<SearchParams>;
}) {
  await props.searchParams;
  const session = await serverSession.getServerSession();
  const franchise = await currentFranchiseService.getCurrentUserFranchise(
    session
  );

  return (
    <div className="flex flex-col space-y-8">
      <h1 className="text-2xl font-semibold">Tableau de bord</h1>

      {franchise ? (
        <section className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Ma franchise</h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground text-sm">Nom</dt>
              <dd className="font-medium">{franchise.name}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Email</dt>
              <dd className="font-medium">{franchise.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Téléphone</dt>
              <dd className="font-medium">{franchise.phone}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground text-sm">Adresse</dt>
              <dd className="font-medium">
                {franchise.street}, {franchise.zip} {franchise.city}{" "}
                {franchise.state}
              </dd>
            </div>
          </dl>
        </section>
      ) : (
        <p className="text-muted-foreground text-sm">
          Aucune franchise associée à votre compte.
        </p>
      )}
    </div>
  );
}
