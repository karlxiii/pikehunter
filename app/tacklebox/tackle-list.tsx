"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTackles, createTackle, getTackleTypes } from "@/app/actions";
import AutocompleteInput from "@/app/components/autocomplete-input";
import { useT } from "@/lib/i18n";

export default function TackleList() {
  const router = useRouter();
  const { t } = useT();
  const [tackles, setTackles] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", weight: "", colour: "", type: "" });
  const [message, setMessage] = useState("");
  const [tackleTypes, setTackleTypes] = useState<string[]>([]);

  useEffect(() => {
    getTackles().then((res) => {
      if (res.data) {
        setTackles(res.data);
      }
      setLoading(false);
    });
    getTackleTypes().then((res) => {
      if (res.data) setTackleTypes(res.data);
    });
  }, []);

  async function handleAdd() {
    if (!form.name.trim()) return;
    setSaving(true);
    setMessage("");
    const result = await createTackle({
      name: form.name.trim(),
      weight: form.weight ? Number(form.weight) : null,
      colour: form.colour.trim() || null,
      type: form.type.trim() || null,
    });
    if (result.success) {
      setForm({ name: "", weight: "", colour: "", type: "" });
      setShowForm(false);
      // Refresh list
      const res = await getTackles();
      if (res.data) setTackles(res.data);
      const typesRes = await getTackleTypes();
      if (typesRes.data) setTackleTypes(typesRes.data);
    } else {
      setMessage(`Error: ${result.error}`);
    }
    setSaving(false);
  }

  if (loading) {
    return <p className="text-gray-500 dark:text-slate-400">{t("common.loading")}</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{t("tacklebox.title")}</h2>
      {showForm ? (
        <div className="space-y-3 border dark:border-slate-600 rounded p-4 bg-white dark:bg-slate-800">
          <h3 className="text-lg font-bold">{t("tacklebox.addTackle")}</h3>
          <div>
            <label className="block text-sm font-medium">{t("common.name")}</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border dark:border-slate-600 rounded px-3 py-2 dark:bg-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">{t("fish.weightUnit")}</label>
            <input
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
              type="number"
              step="0.1"
              className="w-full border dark:border-slate-600 rounded px-3 py-2 dark:bg-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">{t("tacklebox.colour")}</label>
            <input
              value={form.colour}
              onChange={(e) => setForm({ ...form, colour: e.target.value })}
              className="w-full border dark:border-slate-600 rounded px-3 py-2 dark:bg-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">{t("common.type")}</label>
            <AutocompleteInput
              value={form.type}
              onChange={(val) => setForm({ ...form, type: val })}
              suggestions={tackleTypes}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              disabled={saving || !form.name.trim()}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? t("tacklebox.adding") : t("common.add")}
            </button>
            <button
              onClick={() => { setShowForm(false); setMessage(""); }}
              className="flex-1 border dark:border-slate-600 px-4 py-2 rounded hover:bg-gray-50 dark:hover:bg-slate-700"
            >
              {t("common.cancel")}
            </button>
          </div>
          {message && (
            <p className="text-red-600">{message}</p>
          )}
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {t("tacklebox.addTackle")}
        </button>
      )}

      {tackles.length === 0 && !showForm ? (
        <p className="text-gray-500 dark:text-slate-400">{t("tacklebox.noTackles")}</p>
      ) : (
        <ul className="space-y-2">
          {tackles.map((tackle) => (
        <li
          key={tackle.value}
          onClick={() => router.push(`/tacklebox/${encodeURIComponent(tackle.value)}`)}
          className="flex items-center gap-3 px-4 py-3 border dark:border-slate-600 rounded bg-white dark:bg-slate-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 active:bg-gray-100 dark:active:bg-slate-600"
        >
          <svg
            className="w-5 h-5 text-gray-400 dark:text-slate-500 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v9c0 3-2.5 5-4.5 5S4 16 4 14.5c0-1.2 1-2 2-1.5"
            />
            <circle cx="12" cy="3" r="1.5" fill="currentColor" stroke="none" />
          </svg>
          <span className="flex-1">{tackle.label}</span>
          <svg
            className="w-4 h-4 text-gray-400 dark:text-slate-500 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </li>
      ))}
    </ul>
      )}
    </div>
  );
}
