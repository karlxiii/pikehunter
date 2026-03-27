"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFish, updateFish, deleteFish, getTackles, getTackleInfo, getLocations, getLocationInfo } from "@/app/actions";
import SpeciesInput from "@/app/components/species-input";
import AutocompleteInput from "@/app/components/autocomplete-input";
import { useConfirm } from "@/app/components/confirm-modal";

type Fish = {
  id: string;
  created_at: string;
  species: string | null;
  weight: number | null;
  length: number | null;
  location: string | null;
  location_id: string | null;
  caught_at: string | null;
  additional_info: string | null;
  depth: number | null;
  weather: string | null;
  tackle_id: string | null;
  image_url: string | null;
};

export default function FishDetail({ id }: { id: string }) {
  const router = useRouter();
  const { confirm, modal } = useConfirm();
  const [fish, setFish] = useState<Fish | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [tackles, setTackles] = useState<{ label: string; value: string; name: string; displayValue: string }[]>([]);
  const [tackleName, setTackleName] = useState("");
  const [selectedTackleId, setSelectedTackleId] = useState("");
  const [locations, setLocations] = useState<{ label: string; value: string; displayValue: string }[]>([]);
  const [locationName, setLocationName] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [form, setForm] = useState({
    species: "",
    weight: "",
    length: "",
    location: "",
    caught_at: "",
    additional_info: "",
    depth: "",
    weather: "",
    tackle_display: "",
  });

  useEffect(() => {
    async function load() {
      const result = await getFish(id);
      if (result.data) {
        setFish(result.data);
        setForm({
          species: result.data.species ?? "",
          weight: result.data.weight?.toString() ?? "",
          length: result.data.length?.toString() ?? "",
          location: result.data.location ?? "",
          caught_at: result.data.caught_at ?? "",
          additional_info: result.data.additional_info ?? "",
          depth: result.data.depth?.toString() ?? "",
          weather: result.data.weather ?? "",
          tackle_display: "",
        });
        setSelectedTackleId(result.data.tackle_id ?? "");
        setSelectedLocationId(result.data.location_id ?? "");
        // Fetch tackle name if there's a tackle_id
        if (result.data.tackle_id) {
          getTackleInfo(result.data.tackle_id).then((tackleRes) => {
            if (tackleRes.data) {
              const parts: string[] = [];
              if (tackleRes.data.type) parts.push(tackleRes.data.type);
              if (tackleRes.data.weight) parts.push(`${tackleRes.data.weight}g`);
              if (tackleRes.data.colour) parts.push(tackleRes.data.colour);
              const display = parts.length > 0
                ? `${tackleRes.data.name} (${parts.join(", ")})`
                : tackleRes.data.name;
              setTackleName(display);
              setForm((prev) => ({ ...prev, tackle_display: tackleRes.data.name }));
            }
          });
        }
        if (result.data.location_id) {
          getLocationInfo(result.data.location_id).then((locRes) => {
            if (locRes.data) {
              setLocationName(locRes.data.name);
              setForm((prev) => ({ ...prev, location: locRes.data.name }));
            }
          });
        } else if (result.data.location) {
          setLocationName(result.data.location);
        }
      }
      setLoading(false);
    }
    load();
    getTackles().then((res) => {
      if (res.data) setTackles(res.data);
    });
    getLocations().then((res) => {
      if (res.data) setLocations(res.data);
    });
  }, [id]);

  async function handleDelete() {
    const ok = await confirm({
      title: "Delete catch",
      message: "Are you sure you want to delete this catch? This cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    setDeleting(true);
    const result = await deleteFish(id);
    if (result.success) {
      router.push("/catches");
    } else {
      alert(`Delete failed: ${result.error}`);
      setDeleting(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    const result = await updateFish(id, {
      species: form.species || null,
      weight: form.weight ? Number(form.weight) : null,
      length: form.length ? Number(form.length) : null,
      location: form.location || null,
      location_id: selectedLocationId || null,
      caught_at: form.caught_at || null,
      additional_info: form.additional_info || null,
      depth: form.depth ? Number(form.depth) : null,
      weather: form.weather || null,
      tackle_id: selectedTackleId || null,
    });
    if (result.success) {
      setFish((prev) =>
        prev
          ? {
              ...prev,
              species: form.species || null,
              weight: form.weight ? Number(form.weight) : null,
              length: form.length ? Number(form.length) : null,
              location: form.location || null,
              location_id: selectedLocationId || null,
              caught_at: form.caught_at || null,
              additional_info: form.additional_info || null,
              depth: form.depth ? Number(form.depth) : null,
              weather: form.weather || null,
              tackle_id: selectedTackleId || null,
            }
          : null
      );
      setEditing(false);
    } else {
      alert(`Save failed: ${result.error}`);
    }
    setSaving(false);
  }

  if (loading) {
    return <p className="text-gray-500 dark:text-slate-400 p-8">Loading...</p>;
  }

  if (!fish) {
    return <p className="text-gray-500 dark:text-slate-400 p-8">Fish not found.</p>;
  }

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <button
        onClick={() => router.push("/catches")}
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        ← Back to My Catches
      </button>

      {fish.image_url && (
        <img
          src={fish.image_url}
          alt={fish.species ?? "Fish"}
          className="w-full max-h-64 object-contain rounded"
        />
      )}

      {editing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-slate-300">
              Species
            </label>
            <SpeciesInput
              value={form.species}
              onChange={(val) => setForm({ ...form, species: val })}
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 dark:text-slate-300">
                Weight (g)
              </label>
              <input
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                type="number"
                step="0.01"
                className="w-full border dark:border-slate-600 rounded px-3 py-2 dark:bg-slate-700"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 dark:text-slate-300">
                Length (cm)
              </label>
              <input
                value={form.length}
                onChange={(e) => setForm({ ...form, length: e.target.value })}
                type="number"
                step="0.1"
                className="w-full border dark:border-slate-600 rounded px-3 py-2 dark:bg-slate-700"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-slate-300">
              Location
            </label>
            <AutocompleteInput
              value={form.location}
              onChange={(val) => {
                setForm({ ...form, location: val });
                setSelectedLocationId("");
              }}
              onSelect={(item) => {
                if (typeof item !== "string") {
                  setSelectedLocationId(item.value);
                }
              }}
              suggestions={locations}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-slate-300">
              Date Caught
            </label>
            <input
              value={form.caught_at}
              onChange={(e) => setForm({ ...form, caught_at: e.target.value })}
              type="date"
              className="w-full border dark:border-slate-600 rounded px-3 py-2 dark:bg-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-slate-300">
              Depth (m)
            </label>
            <input
              value={form.depth}
              onChange={(e) => setForm({ ...form, depth: e.target.value })}
              type="number"
              step="0.1"
              className="w-full border dark:border-slate-600 rounded px-3 py-2 dark:bg-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-slate-300">
              Weather
            </label>
            <input
              value={form.weather}
              onChange={(e) => setForm({ ...form, weather: e.target.value })}
              className="w-full border dark:border-slate-600 rounded px-3 py-2 dark:bg-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-slate-300">
              Tackle
            </label>
            <AutocompleteInput
              value={form.tackle_display}
              onChange={(val) => {
                setForm({ ...form, tackle_display: val });
                setSelectedTackleId("");
              }}
              onSelect={(item) => {
                if (typeof item !== "string") {
                  setSelectedTackleId(item.value);
                }
              }}
              suggestions={tackles}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-slate-300">
              Additional Info
            </label>
            <textarea
              value={form.additional_info}
              onChange={(e) =>
                setForm({ ...form, additional_info: e.target.value })
              }
              rows={3}
              className="w-full border dark:border-slate-600 rounded px-3 py-2 dark:bg-slate-700"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="flex-1 border dark:border-slate-600 px-4 py-2 rounded hover:bg-gray-50 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <span className="text-sm text-gray-500 dark:text-slate-400">Species</span>
            <p className="text-lg font-semibold">
              {fish.species ?? "Unknown"}
            </p>
          </div>
          <div className="flex gap-6">
            {fish.weight != null && (
              <div>
                <span className="text-sm text-gray-500 dark:text-slate-400">Weight</span>
                <p>{fish.weight} g</p>
              </div>
            )}
            {fish.length != null && (
              <div>
                <span className="text-sm text-gray-500 dark:text-slate-400">Length</span>
                <p>{fish.length} cm</p>
              </div>
            )}
          </div>
          {(fish.location || locationName) && (
            <div>
              <span className="text-sm text-gray-500 dark:text-slate-400">Location</span>
              <p>{locationName || fish.location}</p>
            </div>
          )}
          {fish.caught_at && (
            <div>
              <span className="text-sm text-gray-500 dark:text-slate-400">Date Caught</span>
              <p>{fish.caught_at}</p>
            </div>
          )}
          {fish.depth != null && (
            <div>
              <span className="text-sm text-gray-500 dark:text-slate-400">Depth</span>
              <p>{fish.depth} m</p>
            </div>
          )}
          {fish.weather && (
            <div>
              <span className="text-sm text-gray-500 dark:text-slate-400">Weather</span>
              <p>{fish.weather}</p>
            </div>
          )}
          {tackleName && (
            <div>
              <span className="text-sm text-gray-500 dark:text-slate-400">Tackle</span>
              <p>{tackleName}</p>
            </div>
          )}
          {fish.additional_info && (
            <div>
              <span className="text-sm text-gray-500 dark:text-slate-400">Additional Info</span>
              <p>{fish.additional_info}</p>
            </div>
          )}
          <button
            onClick={() => setEditing(true)}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Edit
          </button>
        </div>
      )}
      {modal}
    </div>
  );
}
