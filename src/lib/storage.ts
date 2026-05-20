// Tiny storage adapter so we can swap localStorage for a backend later
// without touching the rest of the app. All reads/writes of user state
// MUST go through this module.

const PREFIX = "a3:"; // namespace, in case other apps share localStorage

function safeStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    const probe = "__a3_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return null;
  }
}

export function get<T = unknown>(key: string, fallback: T | null = null): T | null {
  const s = safeStorage();
  if (!s) return fallback;
  const raw = s.getItem(PREFIX + key);
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function set<T>(key: string, value: T): void {
  const s = safeStorage();
  if (!s) return;
  s.setItem(PREFIX + key, JSON.stringify(value));
}

export function remove(key: string): void {
  const s = safeStorage();
  if (!s) return;
  s.removeItem(PREFIX + key);
}

// Read raw (unnamespaced) localStorage — used to read progress written by
// the legacy /flashcards page which uses its own key.
export function getRaw<T = unknown>(key: string, fallback: T | null = null): T | null {
  const s = safeStorage();
  if (!s) return fallback;
  const raw = s.getItem(key);
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// Convenience: profile (user name)
export const profile = {
  getName(): string | null {
    return get<string>("profile.name", null);
  },
  setName(name: string) {
    set("profile.name", name.trim());
  },
};
