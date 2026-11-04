"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Plus, UserRound, UserRoundX } from "lucide-react";
import { useRouter } from "next/navigation";

type AdminUser = {
  id: string;
  email: string;
  role: "SENIOR_ADMIN" | "PUBLISHER";
  isActive: boolean;
  createdAt: string;
};

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, cache: "no-store" });
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof payload.error === "string"
        ? payload.error
        : "The request could not be completed.";
    throw new Error(message);
  }

  return payload as T;
}

export function PublisherManagement() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<AdminUser[]>([]);
  const [isSeniorAdmin, setIsSeniorAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadAccounts = useCallback(async () => {
    const response = await requestJson<{ data: AdminUser[] }>("/api/admin/publishers");
    setAccounts(response.data);
  }, []);

  useEffect(() => {
    let active = true;

    void requestJson<{ user: AdminUser }>("/api/admin/session")
      .then(async ({ user }) => {
        if (!active || user.role !== "SENIOR_ADMIN") return;
        setIsSeniorAdmin(true);
        const response = await requestJson<{ data: AdminUser[] }>("/api/admin/publishers");
        if (active) setAccounts(response.data);
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        if (requestError instanceof Error && requestError.message === "Authentication required.") {
          router.replace("/admin/login");
          return;
        }
        setError(requestError instanceof Error ? requestError.message : "Admin access could not be checked.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [router]);

  async function createPublisher(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      await requestJson<{ data: AdminUser }>("/api/admin/publishers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      setEmail("");
      setPassword("");
      setNotice("Publisher account created. Share the initial password through a secure channel.");
      await loadAccounts();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Publisher account could not be created.");
    } finally {
      setSaving(false);
    }
  }

  async function setPublisherActive(account: AdminUser) {
    const nextState = !account.isActive;
    if (!nextState && !window.confirm(`Deactivate ${account.email}? They will lose admin access immediately.`)) {
      return;
    }

    setUpdatingId(account.id);
    setError("");
    setNotice("");
    try {
      await requestJson<{ data: AdminUser }>("/api/admin/publishers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: account.id, isActive: nextState }),
      });
      setNotice(nextState ? "Publisher access restored." : "Publisher access deactivated.");
      await loadAccounts();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Publisher access could not be updated.");
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading || !isSeniorAdmin) return null;

  return (
    <section id="admin-accounts-section" className="mt-10 scroll-mt-28 border-y border-[#171713]/20 py-8">
      <div className="max-w-3xl">
        <p className="editorial-eyebrow">Senior admin only</p>
        <h2 className="editorial-heading mt-2 text-3xl">Publisher accounts</h2>
        <p className="mt-3 text-sm leading-6 text-[#171713]/60">
          Publishers can manage all website content and bookings. Only Senior Admins can manage accounts.
        </p>
      </div>

      {error && <p role="alert" className="mt-5 border border-red-800/25 bg-red-950/5 px-4 py-3 text-sm text-red-900">{error}</p>}
      {notice && <p role="status" className="mt-5 border border-[#80643a]/25 bg-[#80643a]/5 px-4 py-3 text-sm text-[#5b4528]">{notice}</p>}

      <form data-admin-search-create="Add new publisher account" data-admin-search-category="Publisher accounts" onSubmit={createPublisher} className="mt-6 grid max-w-3xl gap-4 border-b border-[#171713]/15 pb-6 sm:grid-cols-2">
        <label className="block text-[9px] uppercase tracking-[0.15em] text-[#171713]/65">
          Publisher email
          <input
            type="email"
            autoComplete="email"
            required
            maxLength={320}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="editorial-input mt-1"
          />
        </label>
        <label className="block text-[9px] uppercase tracking-[0.15em] text-[#171713]/65">
          Initial password
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={14}
            maxLength={128}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="editorial-input mt-1"
          />
          <span className="mt-1 block normal-case tracking-normal text-[#171713]/50">At least 14 characters.</span>
        </label>
        <div className="sm:col-span-2">
          <button type="submit" disabled={saving} className="editorial-button-dark disabled:opacity-60">
            <Plus className="h-4 w-4" />
            {saving ? "Creating…" : "Create publisher"}
          </button>
        </div>
      </form>

      <ul className="mt-5 max-w-3xl divide-y divide-[#171713]/10">
        {accounts.map((account) => (
          <li key={account.id} data-admin-search-record data-admin-search-label={account.email} data-admin-search-keywords={`${account.role} ${account.isActive ? "active" : "inactive"} publisher account`} data-admin-search-category={account.role === "SENIOR_ADMIN" ? "Senior admin account" : "Publisher account"} className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div className="min-w-0">
              <p className="break-all text-sm text-[#171713]">{account.email}</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#171713]/50">
                {account.role === "SENIOR_ADMIN" ? "Senior Admin" : "Publisher"} · {account.isActive ? "Active" : "Inactive"}
              </p>
            </div>
            {account.role === "PUBLISHER" && (
              <button
                type="button"
                disabled={updatingId === account.id}
                onClick={() => void setPublisherActive(account)}
                className="editorial-button-outline disabled:opacity-60"
              >
                {account.isActive ? <UserRoundX className="h-4 w-4" /> : <UserRound className="h-4 w-4" />}
                {account.isActive ? "Deactivate" : "Reactivate"}
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
