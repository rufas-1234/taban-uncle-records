"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function getErrorMessage(value: unknown) {
  if (typeof value !== "object" || value === null || !("error" in value)) {
    return "The request could not be completed.";
  }

  if (typeof value.error === "string") {
    return value.error;
  }

  return "Some fields need attention. Check the email, password, and links.";
}

export function AdminAccessForm({ mode }: { mode: "login" | "setup" }) {
  const router = useRouter();
  const isSetup = mode === "setup";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [setupToken, setSetupToken] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/${isSetup ? "setup" : "session"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, ...(isSetup ? { setupToken } : {}) }),
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        setError(getErrorMessage(payload));
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("The admin service could not be reached. Check the database and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <p className="editorial-eyebrow">{isSetup ? "Secure first-time setup" : "Studio administration"}</p>
      <h1 className="editorial-page-title mt-4 text-5xl sm:text-6xl">
        {isSetup ? <>Create your <em>admin.</em></> : <>Welcome <em>back.</em></>}
      </h1>
      <p className="mt-5 max-w-lg text-sm leading-7 text-[#171713]/65">
        {isSetup
          ? "Use the private setup token from your server environment, then choose the email and password you will use to manage the culture archive."
          : "Sign in to manage featured artists, songs, performances, source links, and publication status."}
      </p>

      <form onSubmit={submit} className="mt-9 space-y-6 border-y border-[#171713]/20 py-7">
        {isSetup && (
          <label className="block text-[10px] uppercase tracking-[0.18em] text-[#171713]/65">
            First-run setup token
            <input
              type="password"
              name="setupToken"
              autoComplete="off"
              required
              minLength={32}
              value={setupToken}
              onChange={(event) => setSetupToken(event.target.value)}
              className="editorial-input mt-1 normal-case tracking-normal"
            />
          </label>
        )}
        <label className="block text-[10px] uppercase tracking-[0.18em] text-[#171713]/65">
          Admin email
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            maxLength={320}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="editorial-input mt-1 normal-case tracking-normal"
          />
        </label>
        <label className="block text-[10px] uppercase tracking-[0.18em] text-[#171713]/65">
          Password
          <input
            type="password"
            name="password"
            autoComplete={isSetup ? "new-password" : "current-password"}
            required
            minLength={isSetup ? 14 : 1}
            maxLength={128}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="editorial-input mt-1 normal-case tracking-normal"
          />
          {isSetup && (
            <span className="mt-2 block text-[10px] normal-case tracking-normal text-[#171713]/50">
              Use at least 14 characters. No default password is created.
            </span>
          )}
        </label>

        {error && (
          <p role="alert" className="border border-red-800/25 bg-red-950/5 px-4 py-3 text-sm text-red-900">
            {error}
          </p>
        )}

        <button type="submit" disabled={isSubmitting} className="editorial-button-dark disabled:opacity-60">
          {isSubmitting ? "Please wait…" : isSetup ? "Create secure admin" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-[#171713]/60">
        {isSetup ? "Already set up?" : "Setting up this studio for the first time?"}{" "}
        <Link
          href={isSetup ? "/admin/login" : "/admin/setup"}
          className="text-[#80643a] underline underline-offset-4"
        >
          {isSetup ? "Go to sign in" : "Create the first admin"}
        </Link>
      </p>
    </div>
  );
}
