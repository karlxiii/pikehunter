"use client";

import { useEffect, useRef, useState } from "react";
import { getProfile, updateProfile, deleteAvatar } from "@/app/actions";

export default function ProfileForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    getProfile().then((res) => {
      if (res.data) {
        setDisplayName(res.data.display_name ?? "");
        setLocation(res.data.location ?? "");
        setBio(res.data.bio ?? "");
        setAvatarUrl(res.data.avatar_url ?? null);
      }
      setLoading(false);
    });
  }, []);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const formData = new FormData(e.target as HTMLFormElement);
    const result = await updateProfile(formData);

    if (result.success) {
      setMessage("Profile saved!");
      if (avatarPreview) {
        setAvatarUrl(avatarPreview);
        setAvatarPreview(null);
      }
    } else {
      setMessage(`Error: ${result.error}`);
    }
    setSaving(false);
  }

  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  const displayedImage = avatarPreview ?? avatarUrl;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col items-center gap-2">
        {displayedImage ? (
          <img
            src={displayedImage}
            alt="Profile picture"
            className="w-24 h-24 rounded-full object-cover border"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        )}
        <div className="flex gap-2">
          <label
            htmlFor="avatar"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 border rounded cursor-pointer hover:bg-gray-200 text-sm"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Change photo
          </label>
          {displayedImage && (
            <button
              type="button"
              onClick={async () => {
                const result = await deleteAvatar();
                if (result.success) {
                  setAvatarUrl(null);
                  setAvatarPreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }
              }}
              className="inline-flex items-center px-3 py-2 bg-gray-100 border rounded hover:bg-red-50 hover:border-red-300 text-sm"
              aria-label="Remove photo"
            >
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          id="avatar"
          name="avatar"
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden"
        />
      </div>
      <div>
        <label htmlFor="display_name" className="block text-sm font-medium">
          Display Name
        </label>
        <input
          id="display_name"
          name="display_name"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="profile_location" className="block text-sm font-medium">
          Location
        </label>
        <input
          id="profile_location"
          name="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="bio" className="block text-sm font-medium">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Profile"}
      </button>
      {message && (
        <p
          className={
            message.startsWith("Error") ? "text-red-600" : "text-green-600"
          }
        >
          {message}
        </p>
      )}
    </form>
  );
}
