"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFishesByTackle, getTackleInfo, updateTackleInfo, getTackleTypes } from "@/app/actions";
import AutocompleteInput from "@/app/components/autocomplete-input";

type Fish = {
  id: string;
  species: string | null;
  weight: number | null;
  length: number | null;
  caught_at: string | null;
  image_url: string | null;
};

export default function TackleFishes({ tackleId }: { tackleId: string }) {
  const router = useRouter();
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ name: "", weight: "", colour: "", type: "" });
  const [tackleTypes, setTackleTypes] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([
      getFishesByTackle(tackleId),
      getTackleInfo(tackleId),
      getTackleTypes(),
    ]).then(([fishRes, tackleRes, typesRes]) => {
      if (fishRes.data) setFishes(fishRes.data);
      if (tackleRes.data) {
        setForm({
          name: tackleRes.data.name ?? "",
          weight: tackleRes.data.weight?.toString() ?? "",
          colour: tackleRes.data.colour ?? "",
          type: tackleRes.data.type ?? "",
        });
      }
      if (typesRes.data) setTackleTypes(typesRes.data);
      setLoading(false);
    });
  }, [tackleId]);

  async function handleSave() {
    setSaving(true);
    setMessage("");
    const result = await updateTackleInfo(tackleId, {
      name: form.name || undefined,
      weight: form.weight ? Number(form.weight) : null,
      colour: form.colour || null,
      type: form.type || null,
    });
    if (result.success) {
      setMessage("Saved!");
    } else {
      setMessage(`Error: ${result.error}`);
    }
    setSaving(false);
  }

  if (loading) {
    return <p className="text-gray-500 dark:text-slate-400">Loading...</p>;
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push("/tacklebox")}
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        ← Back to Tacklebox
      </button>

      <div className="space-y-3 border dark:border-slate-600 rounded p-4 bg-white dark:bg-slate-800">
        <h2 className="text-lg font-bold">Tackle Info</h2>
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border dark:border-slate-600 rounded px-3 py-2 dark:bg-slate-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Weight (g)</label>
          <input
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
            type="number"
            step="0.1"
            className="w-full border dark:border-slate-600 rounded px-3 py-2 dark:bg-slate-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Colour</label>
          <input
            value={form.colour}
            onChange={(e) => setForm({ ...form, colour: e.target.value })}
            className="w-full border dark:border-slate-600 rounded px-3 py-2 dark:bg-slate-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Type</label>
          <AutocompleteInput
            value={form.type}
            onChange={(val) => setForm({ ...form, type: val })}
            suggestions={tackleTypes}
            placeholder="Type to search..."
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        {message && (
          <p className={message.startsWith("Error") ? "text-red-600" : "text-green-600"}>
            {message}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-bold">
          Catches ({fishes.length})
        </h3>
        {fishes.length === 0 ? (
          <p className="text-gray-500 dark:text-slate-400">No catches with this tackle.</p>
        ) : (
          <ul className="space-y-2">
            {fishes.map((fish) => (
              <li
                key={fish.id}
                onClick={() => router.push(`/catches/${fish.id}`)}
                className="border dark:border-slate-600 rounded p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 active:bg-gray-100 dark:active:bg-slate-600"
              >
                {fish.image_url && (
                  <img
                    src={fish.image_url}
                    alt={fish.species ?? "Fish"}
                    className="w-full max-h-48 object-contain rounded mb-2"
                  />
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <strong>{fish.species ?? "Unknown species"}</strong>
                    {fish.weight != null && <span> — {fish.weight} g</span>}
                    {fish.length != null && <span>, {fish.length} cm</span>}
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 dark:text-slate-500 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                {fish.caught_at && (
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{fish.caught_at}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
