import { serverSession } from "@/lib/session/server-session";

import DataTableMembers from "./_components/data-table-members";
import FormMembers from "./_components/form-members";
// import { redirect } from "next/navigation";

export default async function Members() {
  const session = await serverSession.getServerSession();

  // if (session.role !== "ADMIN" && session.role !== "FRANCHISE_OWNER") {
  //   return redirect("/");
  // }

  return (
    <div className="flex-col space-y-8">
      <h1>Membres</h1>
      <div className="max-w-2xl space-y-5">
        <h2>Inviter un membre</h2>
        <p className="text-sm leading-normal">
          Invitez vos collègues à devenir membre de votre équipe, et collaborez
          avec eux, en leur attribuant les privilèges dont ils auront besoins
          pour leurs tâches propres.
        </p>
        <FormMembers />
      </div>
      <h2>Gérer vos membres</h2>
      <DataTableMembers session={session} />
    </div>
  );
}
