import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FishManager from "./fish-manager";
import Header from "./components/header";

const devMode = process.env.NEXT_PUBLIC_DEV_SKIP_AUTH === "true";

export default async function Home() {
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
      <main className="p-8 max-w-2xl mx-auto w-full">
        <FishManager />
      </main>
    </>
  );
}