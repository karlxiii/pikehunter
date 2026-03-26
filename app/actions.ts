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
  const caught_at = formData.get("caught_at") as string;
  const additional_info = formData.get("additional_info") as string;
  const depth = formData.get("depth") as string;
  const weather = formData.get("weather") as string;
  const tackle_name = formData.get("tackle") as string;
  const tackle_id_raw = formData.get("tackle_id") as string;
  const location_name = formData.get("location") as string;
  const location_id_raw = formData.get("location_id") as string;
  const image = formData.get("image") as File | null;

  let image_url: string | null = null;
  let tackle_id: string | null = tackle_id_raw || null;
  let location_id: string | null = location_id_raw || null;

  // If user typed a tackle name but didn't select an existing one, create a new tackle
  if (tackle_name && !tackle_id) {
    const { data: newTackle, error: tackleError } = await supabase
      .from("tackles")
      .insert({ user_id: user.id, name: tackle_name })
      .select("id")
      .single();

    if (tackleError) {
      return { message: `Tackle error: ${tackleError.message}`, success: false };
    }
    tackle_id = newTackle.id;
  }

  // If user typed a location name but didn't select an existing one, create a new location
  if (location_name && !location_id) {
    const { data: newLocation, error: locationError } = await supabase
      .from("locations")
      .insert({ user_id: user.id, name: location_name })
      .select("id")
      .single();

    if (locationError) {
      return { message: `Location error: ${locationError.message}`, success: false };
    }
    location_id = newLocation.id;
  }

  if (image && image.size > 0) {
    const ext = image.name.split(".").pop();
    const filePath = `${user.id}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("FishImages")
      .upload(filePath, image);

    if (uploadError) {
      return { message: `Upload error: ${uploadError.message}`, success: false };
    }

    const { data: urlData } = supabase.storage
      .from("FishImages")
      .getPublicUrl(filePath);

    image_url = urlData.publicUrl;
  }

  const { error } = await supabase.from("fishes").insert({
    species: species || null,
    weight: weight ? Number(weight) : null,
    length: length ? Number(length) : null,
    location: location_name || null,
    location_id: location_id || null,
    caught_at: caught_at || null,
    additional_info: additional_info || null,
    depth: depth ? Number(depth) : null,
    weather: weather || null,
    tackle_id: tackle_id || null,
    user_id: user.id,
    image_url,
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
    .order("caught_at", { ascending: false, nullsFirst: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function getTackles() {
  const user = await getUser();
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("tackles")
    .select("id, name, weight, colour, type")
    .eq("user_id", user.id)
    .order("name");

  if (error) {
    return { data: null, error: error.message };
  }

  const items = (data ?? []).map((t) => {
    const parts: string[] = [];
    if (t.type) parts.push(t.type);
    if (t.weight) parts.push(`${t.weight}g`);
    if (t.colour) parts.push(t.colour);
    const label = parts.length > 0 ? `${t.name} (${parts.join(", ")})` : t.name;
    return { value: t.id, label, name: t.name, displayValue: label };
  });

  return { data: items, error: null };
}

export async function getFishesByTackle(tackleId: string) {
  const user = await getUser();
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("fishes")
    .select("*")
    .eq("user_id", user.id)
    .eq("tackle_id", tackleId)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function getTackleInfo(tackleId: string) {
  await getUser();
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("tackles")
    .select("*")
    .eq("id", tackleId)
    .single();

  if (error && error.code !== "PGRST116") {
    return { data: null, error: error.message };
  }

  return { data: data ?? null, error: null };
}

export async function updateTackleInfo(
  tackleId: string,
  fields: { name?: string; weight?: number | null; colour?: string | null; type?: string | null }
) {
  await getUser();
  const supabase = await getSupabase();

  const { error } = await supabase
    .from("tackles")
    .update(fields)
    .eq("id", tackleId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function createTackle(fields: {
  name: string;
  weight?: number | null;
  colour?: string | null;
  type?: string | null;
}) {
  const user = await getUser();
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("tackles")
    .insert({ user_id: user.id, ...fields })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message, id: null };
  }

  return { success: true, error: null, id: data.id };
}

export async function getTackleTypes() {
  const user = await getUser();
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("tackles")
    .select("type")
    .eq("user_id", user.id)
    .not("type", "is", null);

  if (error) {
    return { data: null, error: error.message };
  }

  const unique = [...new Set((data ?? []).map((t) => t.type as string))].sort();
  return { data: unique, error: null };
}

export async function getFish(id: string) {
  await getUser();
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("fishes")
    .select("*")
    .eq("id", id)
    .single();

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

export async function updateFish(
  id: string,
  fields: {
    species?: string | null;
    weight?: number | null;
    length?: number | null;
    location?: string | null;
    location_id?: string | null;
    caught_at?: string | null;
    additional_info?: string | null;
    depth?: number | null;
    weather?: string | null;
    tackle_id?: string | null;
  }
) {
  await getUser();
  const supabase = await getSupabase();

  const { error } = await supabase
    .from("fishes")
    .update(fields)
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function deleteFish(id: string) {
  await getUser();
  const supabase = await getSupabase();

  const { error } = await supabase
    .from("fishes")
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function getProfile() {
  const user = await getUser();
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    return { data: null, error: error.message };
  }

  return { data: data ?? null, error: null };
}

export async function updateProfile(formData: FormData) {
  const user = await getUser();
  const supabase = await getSupabase();

  const display_name = formData.get("display_name") as string;
  const location = formData.get("location") as string;
  const bio = formData.get("bio") as string;
  const avatar = formData.get("avatar") as File | null;

  const fields: Record<string, string | null> = {
    display_name: display_name || null,
    location: location || null,
    bio: bio || null,
  };

  if (avatar && avatar.size > 0) {
    const ext = avatar.name.split(".").pop();
    const filePath = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("Avatars")
      .upload(filePath, avatar, { upsert: true });

    if (uploadError) {
      return { success: false, error: `Upload error: ${uploadError.message}` };
    }

    const { data: urlData } = supabase.storage
      .from("Avatars")
      .getPublicUrl(filePath);

    fields.avatar_url = urlData.publicUrl;
  }

  const { error } = await supabase
    .from("profiles")
    .upsert(
      { user_id: user.id, ...fields },
      { onConflict: "user_id" }
    );

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function getLocations() {
  const user = await getUser();
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("locations")
    .select("id, name")
    .eq("user_id", user.id)
    .order("name");

  if (error) {
    return { data: null, error: error.message };
  }

  const items = (data ?? []).map((l) => ({
    value: l.id,
    label: l.name,
    displayValue: l.name,
  }));

  return { data: items, error: null };
}

export async function getFishesByLocation(locationId: string) {
  const user = await getUser();
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("fishes")
    .select("*")
    .eq("user_id", user.id)
    .eq("location_id", locationId)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function getLocationInfo(locationId: string) {
  await getUser();
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("id", locationId)
    .single();

  if (error && error.code !== "PGRST116") {
    return { data: null, error: error.message };
  }

  return { data: data ?? null, error: null };
}

export async function updateLocationInfo(
  locationId: string,
  fields: { name?: string }
) {
  await getUser();
  const supabase = await getSupabase();

  const { error } = await supabase
    .from("locations")
    .update(fields)
    .eq("id", locationId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function deleteAvatar() {
  const user = await getUser();
  const supabase = await getSupabase();

  const { data: profile } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("user_id", user.id)
    .single();

  if (profile?.avatar_url) {
    const url = new URL(profile.avatar_url);
    const path = url.pathname.split("/Avatars/")[1];
    if (path) {
      await supabase.storage.from("Avatars").remove([decodeURIComponent(path)]);
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: null })
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
