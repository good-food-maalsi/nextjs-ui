import { redirect } from "next/navigation";

export default function ClientPage() {
  // Redirect to home page by default
  redirect("/client/home");
}
