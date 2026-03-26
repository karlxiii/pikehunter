"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLocations } from "@/app/actions";

export default function LocationList() {
  const router = useRouter();
  const [locations, setLocations] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLocations().then((res) => {
      if (res.data) {
        setLocations(res.data);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  if (locations.length === 0) {
    return <p className="text-gray-500">No locations yet. Add a fish with a location to see it here.</p>;
  }

  return (
    <ul className="space-y-2">
      {locations.map((location) => (
        <li
          key={location.value}
          onClick={() => router.push(`/locations/${encodeURIComponent(location.value)}`)}
          className="flex items-center gap-3 px-4 py-3 border rounded bg-white cursor-pointer hover:bg-gray-50 active:bg-gray-100"
        >
          <svg
            className="w-5 h-5 text-gray-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="flex-1">{location.label}</span>
          <svg
            className="w-4 h-4 text-gray-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </li>
      ))}
    </ul>
  );
}
