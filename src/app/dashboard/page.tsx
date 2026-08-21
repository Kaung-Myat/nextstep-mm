import { redirect } from "next/navigation";

/** Dashboard content now lives on Home — keep this route for old links. */
export default function DashboardPage() {
  redirect("/");
}
