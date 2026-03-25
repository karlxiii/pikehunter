import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FishManager from "./fish-manager";

const devMode = process.env.NEXT_PUBLIC_DEV_SKIP_AUTH === "true";

export default async function Home() {
  let email = "dev@localhost";

  if (!devMode) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }
    email = user.email ?? "";
  }

  return (
    <main className="p-8">
      <div className="flex items-center justify-between max-w-md mb-6">
        <h1 className="text-3xl font-bold">PikeHunter 🐟</h1>
        <span className="text-sm text-gray-500">{email}</span>
      </div>
      <FishManager />
    </main>
  );
}