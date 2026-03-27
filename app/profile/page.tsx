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
      <main className="p-8 max-w-2xl mx-auto w-full">
        <ProfileForm email={email} />
      </main>
    </>
  );
}
