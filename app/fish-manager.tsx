"use client";

import { useActionState, useState } from "react";
import { createFish, getFishes, clearAllFishes, signOut } from "./actions";

type Fish = {
  id: string;
  created_at: string;
  species: string | null;
  weight: number | null;
  length: number | null;
  location: string | null;
};

export default function FishManager() {
  const [state, formAction, isPending] = useActionState(createFish, {
    message: "",
    success: false,
  });
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [showFishes, setShowFishes] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleGetFishes() {
    setLoading(true);
    const result = await getFishes();
    if (result.data) {
      setFishes(result.data);
    }
    setShowFishes(true);
    setLoading(false);
  }

  async function handleClearAll() {
    if (!confirm("Delete all fishes?")) return;
    const result = await clearAllFishes();
    if (result.success) {
      setFishes([]);
    }
  }

  async function handleSignOut() {
    await signOut();
  }

  return (
    <div className="space-y-8 max-w-md">
      <section>
        <h2 className="text-xl font-bold mb-4">Add a Fish</h2>
        <form action={formAction} className="space-y-3">
          <div>
            <label htmlFor="species" className="block text-sm font-medium">
              Species
            </label>
            <input
              id="species"
              name="species"
              type="text"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="weight" className="block text-sm font-medium">
              Weight (kg)
            </label>
            <input
              id="weight"
              name="weight"
              type="number"
              step="0.01"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="length" className="block text-sm font-medium">
              Length (cm)
            </label>
            <input
              id="length"
              name="length"
              type="number"
              step="0.1"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? "Adding..." : "Add Fish"}
          </button>
          {state.message && (
            <p
              className={
                state.success ? "text-green-600" : "text-red-600"
              }
            >
              {state.message}
            </p>
          )}
        </form>
      </section>

      <section>
        <div className="flex gap-3">
          <button
            onClick={handleGetFishes}
            disabled={loading}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Show Fishes"}
          </button>
          <button
            onClick={handleClearAll}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Clear All
          </button>
        </div>

        {showFishes && (
          <div className="mt-4">
            {fishes.length === 0 ? (
              <p className="text-gray-500">No fishes found.</p>
            ) : (
              <ul className="space-y-2">
                {fishes.map((fish) => (
                  <li key={fish.id} className="border rounded p-3">
                    <strong>{fish.species ?? "Unknown species"}</strong>
                    {fish.weight != null && <span> — {fish.weight} kg</span>}
                    {fish.length != null && <span>, {fish.length} cm</span>}
                    {fish.location && (
                      <span className="text-gray-500"> @ {fish.location}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      <section className="pt-4 border-t">
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-500 underline hover:text-gray-700"
        >
          Sign Out
        </button>
      </section>
    </div>
  );
}
