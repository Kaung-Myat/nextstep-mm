import { redirect } from "next/navigation";

export default function EditProfileRedirectPage() {
  redirect("/settings/edit");
}
