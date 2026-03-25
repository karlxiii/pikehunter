"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const devMode = process.env.NEXT_PUBLIC_DEV_SKIP_AUTH === "true";
const DEV_USER_ID = "00000000-0000-0000-0000-000000000000";

async function getUser() {
  if (devMode) {
    return { id: DEV_USER_ID, email: "dev@localhost" };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

async function getSupabase() {
  return await createClient();
}

export async function createFish(
  _prevState: { message: string; success: boolean },
  formData: FormData
) {
  const user = await getUser();
  const supabase = await getSupabase();

  const species = formData.get("species") as string;
  const weight = formData.get("weight") as string;
  const length = formData.get("length") as string;
  const location = formData.get("location") as string;

  const { error } = await supabase.from("fishes").insert({
    species: species || null,
    weight: weight ? Number(weight) : null,
    length: length ? Number(length) : null,
    location: location || null,
    user_id: user.id,
  });

  if (error) {
    return { message: `Error: ${error.message}`, success: false };
  }

  return { message: "Fish added!", success: true };
}

export async function getFishes() {
  await getUser();
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("fishes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function clearAllFishes() {
  const user = await getUser();
  const supabase = await getSupabase();

  const { error } = await supabase
    .from("fishes")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    return { message: `Error: ${error.message}`, success: false };
  }

  return { message: "All fishes cleared!", success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
