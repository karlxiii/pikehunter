"use client";

import { useActionState, useEffect, useState } from "react";
import { createFish, getTackles, getLocations } from "./actions";
import SpeciesInput from "./components/species-input";
import AutocompleteInput from "./components/autocomplete-input";

export default function FishManager() {
  const [state, formAction, isPending] = useActionState(createFish, {
    message: "",
    success: false,
  });
  const [showMore, setShowMore] = useState(false);
  const [tackles, setTackles] = useState<{ label: string; value: string; name: string; displayValue: string }[]>([]);
  const [selectedTackleId, setSelectedTackleId] = useState("");
  const [locations, setLocations] = useState<{ label: string; value: string; displayValue: string }[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [speciesValue, setSpeciesValue] = useState("");

  useEffect(() => {
    getTackles().then((res) => {
      if (res.data) setTackles(res.data);
    });
    getLocations().then((res) => {
      if (res.data) setLocations(res.data);
    });
  }, []);

  return (
    <div className="space-y-8 max-w-md">
      <section>
        <h2 className="text-xl font-bold mb-4">Add a Fish</h2>
        <form action={formAction} className="space-y-3">
          <div>
            <label htmlFor="species" className="block text-sm font-medium">
              Species
            </label>
            <SpeciesInput name="species" onChange={(val) => setSpeciesValue(val)} />
          </div>
          <div>
            <label htmlFor="weight" className="block text-sm font-medium">
              Weight (g)
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
            <label htmlFor="caught_at" className="block text-sm font-medium">
              Date Caught
            </label>
            <input
              id="caught_at"
              name="caught_at"
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowMore(!showMore)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showMore ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            More details
          </button>
          {showMore && (
            <div className="space-y-3">
              <div>
                <label htmlFor="location" className="block text-sm font-medium">
                  Location
                </label>
                <input type="hidden" name="location_id" value={selectedLocationId} />
                <AutocompleteInput
                  name="location"
                  suggestions={locations}
                  placeholder="Type to search..."
                  onChange={() => setSelectedLocationId("")}
                  onSelect={(item) => {
                    if (typeof item !== "string") {
                      setSelectedLocationId(item.value);
                    }
                  }}
                />
              </div>
              <div>
                <label htmlFor="tackle" className="block text-sm font-medium">
                  Tackle
                </label>
                <input type="hidden" name="tackle_id" value={selectedTackleId} />
                <AutocompleteInput
                  name="tackle"
                  suggestions={tackles}
                  placeholder="Type to search..."
                  onChange={() => setSelectedTackleId("")}
                  onSelect={(item) => {
                    if (typeof item !== "string") {
                      setSelectedTackleId(item.value);
                    }
                  }}
                />
              </div>
              <div>
                <label htmlFor="depth" className="block text-sm font-medium">
                  Depth (m)
                </label>
                <input
                  id="depth"
                  name="depth"
                  type="number"
                  step="0.1"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="weather" className="block text-sm font-medium">
                  Weather
                </label>
                <input
                  id="weather"
                  name="weather"
                  type="text"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="additional_info" className="block text-sm font-medium">
                  Additional Info
                </label>
                <textarea
                  id="additional_info"
                  name="additional_info"
                  rows={3}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label
                htmlFor="image"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 border rounded cursor-pointer hover:bg-gray-200"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm">Upload photo</span>
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                className="hidden"
              />
            </div>
            <button
              type="submit"
              disabled={isPending || !speciesValue.trim()}
              className="w-full flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? "Adding..." : "Add Fish"}
            </button>
          </div>
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
    </div>
  );
}
