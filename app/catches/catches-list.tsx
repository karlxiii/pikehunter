"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFishes, clearAllFishes } from "@/app/actions";
import { useConfirm } from "@/app/components/confirm-modal";

type Fish = {
  id: string;
  created_at: string;
  species: string | null;
  weight: number | null;
  length: number | null;
  location: string | null;
  caught_at: string | null;
  additional_info: string | null;
  image_url: string | null;
};

export default function CatchesList() {
  const router = useRouter();
  const { confirm, modal } = useConfirm();
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFishes();
  }, []);

  async function loadFishes() {
    setLoading(true);
    const result = await getFishes();
    if (result.data) {
      setFishes(result.data);
    }
    setLoading(false);
  }

  async function handleClearAll() {
    const ok = await confirm({
      title: "Clear all catches",
      message: "Are you sure you want to delete all your catches? This cannot be undone.",
      confirmLabel: "Delete All",
      destructive: true,
    });
    if (!ok) return;
    const result = await clearAllFishes();
    if (result.success) {
      setFishes([]);
    }
  }

  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-md space-y-4">
      {fishes.length === 0 ? (
        <p className="text-gray-500">No catches yet.</p>
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

      {fishes.length > 0 && (
        <button
          onClick={handleClearAll}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Clear All
        </button>
      )}
      {modal}
    </div>
  );
}
