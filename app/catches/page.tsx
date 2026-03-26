import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Header from "@/app/components/header";
import CatchesList from "./catches-list";

const devMode = process.env.NEXT_PUBLIC_DEV_SKIP_AUTH === "true";

export default async function CatchesPage() {
  if (!devMode) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }
  }

  return (
    <>
      <Header />
      <main className="p-8">
        <h2 className="text-2xl font-bold mb-6">My Catches</h2>
        <CatchesList />
      </main>
    </>
  );
}
