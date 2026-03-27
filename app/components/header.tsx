"use client";

import { useEffect, useState } from "react";
import { signOut, getProfile } from "@/app/actions";
import { useT } from "@/lib/i18n";

export default function Header() {
  const { t } = useT();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    getProfile().then((res) => {
      if (res.data?.avatar_url) {
        setAvatarUrl(res.data.avatar_url);
      }
    });
  }, []);

  return (
    <>
      <header className="flex items-center justify-between px-4 py-3 border-b dark:border-slate-600">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-xl font-bold">{t("app.title")}</h1>
        <a
          href="/profile"
          aria-label="Profile"
          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-7 h-7 rounded-full object-cover"
            />
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          )}
        </a>
      </header>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-800 border-r dark:border-slate-600 z-50 transform transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b dark:border-slate-600">
          <span className="text-lg font-bold">{t("nav.menu")}</span>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col p-4 gap-2">
          <li>
            <a
              href="/"
              onClick={() => setSidebarOpen(false)}
              className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              {t("nav.home")}
            </a>
          </li>
          <li>
            <a
              href="/catches"
              onClick={() => setSidebarOpen(false)}
              className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              {t("nav.catches")}
            </a>
          </li>
          <li>
            <a
              href="/tacklebox"
              onClick={() => setSidebarOpen(false)}
              className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              {t("nav.tacklebox")}
            </a>
          </li>
          <li>
            <a
              href="/locations"
              onClick={() => setSidebarOpen(false)}
              className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              {t("nav.locations")}
            </a>
          </li>
        </ul>
        <div className="absolute bottom-0 w-full p-4 border-t dark:border-slate-600">
          <button
            onClick={async () => {
              await signOut();
            }}
            className="text-sm text-gray-500 dark:text-slate-400 underline hover:text-gray-700 dark:hover:text-slate-300"
          >
            {t("nav.signOut")}
          </button>
        </div>
      </nav>
    </>
  );
}
