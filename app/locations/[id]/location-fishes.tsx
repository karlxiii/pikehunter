"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFishesByLocation, getLocationInfo, updateLocationInfo } from "@/app/actions";

type Fish = {
  id: string;
  species: string | null;
  weight: number | null;
  length: number | null;
  caught_at: string | null;
  image_url: string | null;
};

export default function LocationFishes({ locationId }: { locationId: string }) {
  const router = useRouter();
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ name: "" });

  useEffect(() => {
    Promise.all([
      getFishesByLocation(locationId),
      getLocationInfo(locationId),
    ]).then(([fishRes, locRes]) => {
      if (fishRes.data) setFishes(fishRes.data);
      if (locRes.data) {
        setForm({ name: locRes.data.name ?? "" });
      }
      setLoading(false);
    });
  }, [locationId]);

  async function handleSave() {
    setSaving(true);
    setMessage("");
    const result = await updateLocationInfo(locationId, {
      name: form.name || undefined,
    });
    if (result.success) {
      setMessage("Saved!");
    } else {
      setMessage(`Error: ${result.error}`);
    }
    setSaving(false);
  }

  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push("/locations")}
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to Locations
      </button>

      <div className="space-y-3 border rounded p-4 bg-white">
        <h2 className="text-lg font-bold">Location Info</h2>
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded px-3 py-2"
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
          <p className="text-gray-500">No catches at this location.</p>
        ) : (
          <ul className="space-y-2">
            {fishes.map((fish) => (
              <li
                key={fish.id}
                onClick={() => router.push(`/catches/${fish.id}`)}
                className="border rounded p-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
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
                    className="w-4 h-4 text-gray-400 shrink-0"
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
                  <p className="text-sm text-gray-500 mt-1">{fish.caught_at}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
