import { createClient } from "@/lib/supabase/server";
import Header from "@/app/components/header";
import ProfileForm from "./profile-form";

const devMode = process.env.NEXT_PUBLIC_DEV_SKIP_AUTH === "true";

export default async function ProfilePage() {
  let email = "dev@localhost";

  if (!devMode) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    email = user?.email ?? "";
  }

  return (
    <>
      <Header />
      <main className="p-8 max-w-md">
        <h2 className="text-xl font-bold mb-4">My Profile</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">{email}</p>
        <ProfileForm />
      </main>
    </>
  );
}
