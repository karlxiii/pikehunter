"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n";

export default function LoginPage() {
  const { t } = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const supabase = createClient();

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setMessage(t("login.checkEmail"));
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.push("/");
        router.refresh();
      }
    }

    setLoading(false);
  }

  return (
    <main className="flex min-h-full items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-3xl font-bold text-center">
          {t("app.title")}
        </h1>
        <h2 className="text-xl text-center">
          {isSignUp ? t("login.createAccount") : t("login.signIn")}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              {t("login.email")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border dark:border-slate-600 rounded px-3 py-2 dark:bg-slate-700"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              {t("login.password")}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border dark:border-slate-600 rounded px-3 py-2 dark:bg-slate-700"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? t("common.loading")
              : isSignUp
                ? t("login.signUp")
                : t("login.signIn")}
          </button>
        </form>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {message && <p className="text-green-600 text-sm">{message}</p>}

        <p className="text-center text-sm">
          {isSignUp ? t("login.hasAccount") : t("login.noAccount")}{" "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
              setMessage("");
            }}
            className="text-blue-600 dark:text-blue-400 underline"
          >
            {isSignUp ? t("login.signIn") : t("login.signUp")}
          </button>
        </p>
      </div>
    </main>
  );
}
