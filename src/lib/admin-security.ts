import { getSupabaseAuth } from './supabase-auth';

export interface AdminActor {
  email: string;
  role: 'admin' | 'editor';
}

interface RateLimitConfig {
  key: string;
  limit: number;
  windowMs: number;
  cooldownMs?: number;
  message: string;
}

interface RateLimitState {
  timestamps: number[];
  lastAttemptAt?: number;
}

interface AuthorizedAdminCache {
  actor: AdminActor;
  expiresAt: number;
}

const RATE_LIMIT_PREFIX = 'sdg-ai-lab:rate-limit:';
const AUTH_CACHE_KEY = 'sdg-ai-lab:admin-actor';
const AUTH_CACHE_TTL_MS = 60_000;

const memoryStore = new Map<string, string>();

function getStorageValue(key: string): string | null {
  if (typeof window === 'undefined') return memoryStore.get(key) ?? null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return memoryStore.get(key) ?? null;
  }
}

function setStorageValue(key: string, value: string): void {
  if (typeof window === 'undefined') {
    memoryStore.set(key, value);
    return;
  }
  try {
    window.localStorage.setItem(key, value);
  } catch {
    memoryStore.set(key, value);
  }
}

function removeStorageValue(key: string): void {
  if (typeof window === 'undefined') {
    memoryStore.delete(key);
    return;
  }
  try {
    window.localStorage.removeItem(key);
  } catch {
    memoryStore.delete(key);
  }
}

function readRateLimitState(key: string): RateLimitState {
  const raw = getStorageValue(`${RATE_LIMIT_PREFIX}${key}`);
  if (!raw) return { timestamps: [] };

  try {
    const parsed = JSON.parse(raw) as RateLimitState;
    return {
      timestamps: Array.isArray(parsed.timestamps)
        ? parsed.timestamps.filter((value): value is number => typeof value === 'number')
        : [],
      lastAttemptAt: typeof parsed.lastAttemptAt === 'number' ? parsed.lastAttemptAt : undefined,
    };
  } catch {
    return { timestamps: [] };
  }
}

function writeRateLimitState(key: string, state: RateLimitState): void {
  setStorageValue(`${RATE_LIMIT_PREFIX}${key}`, JSON.stringify(state));
}

export function formatRetryDelay(retryAfterMs: number): string {
  const totalSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
  if (totalSeconds < 60) {
    return `${totalSeconds} second${totalSeconds === 1 ? '' : 's'}`;
  }

  const minutes = Math.ceil(totalSeconds / 60);
  return `${minutes} minute${minutes === 1 ? '' : 's'}`;
}

export function consumeRateLimit(
  config: RateLimitConfig
): { allowed: true } | { allowed: false; error: string; retryAfterMs: number } {
  const now = Date.now();
  const state = readRateLimitState(config.key);
  const recentTimestamps = state.timestamps.filter((timestamp) => now - timestamp < config.windowMs);

  if (config.cooldownMs && state.lastAttemptAt && now - state.lastAttemptAt < config.cooldownMs) {
    const retryAfterMs = config.cooldownMs - (now - state.lastAttemptAt);
    writeRateLimitState(config.key, {
      timestamps: recentTimestamps,
      lastAttemptAt: state.lastAttemptAt,
    });
    return {
      allowed: false,
      error: `${config.message} Try again in ${formatRetryDelay(retryAfterMs)}.`,
      retryAfterMs,
    };
  }

  if (recentTimestamps.length >= config.limit) {
    const retryAfterMs = config.windowMs - (now - recentTimestamps[0]);
    writeRateLimitState(config.key, {
      timestamps: recentTimestamps,
      lastAttemptAt: state.lastAttemptAt,
    });
    return {
      allowed: false,
      error: `${config.message} Try again in ${formatRetryDelay(retryAfterMs)}.`,
      retryAfterMs,
    };
  }

  recentTimestamps.push(now);
  writeRateLimitState(config.key, {
    timestamps: recentTimestamps,
    lastAttemptAt: now,
  });
  return { allowed: true };
}

export function normalizeAdminEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function clearAuthorizedAdminCache(): void {
  removeStorageValue(AUTH_CACHE_KEY);
}

function readAuthorizedAdminCache(): AdminActor | null {
  const raw = getStorageValue(AUTH_CACHE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AuthorizedAdminCache;
    if (
      typeof parsed.expiresAt !== 'number' ||
      parsed.expiresAt < Date.now() ||
      !parsed.actor ||
      typeof parsed.actor.email !== 'string' ||
      (parsed.actor.role !== 'admin' && parsed.actor.role !== 'editor')
    ) {
      removeStorageValue(AUTH_CACHE_KEY);
      return null;
    }
    return parsed.actor;
  } catch {
    removeStorageValue(AUTH_CACHE_KEY);
    return null;
  }
}

function writeAuthorizedAdminCache(actor: AdminActor): void {
  setStorageValue(
    AUTH_CACHE_KEY,
    JSON.stringify({
      actor,
      expiresAt: Date.now() + AUTH_CACHE_TTL_MS,
    } satisfies AuthorizedAdminCache)
  );
}

export async function getAuthorizedAdmin(forceRefresh = false): Promise<AdminActor> {
  if (!forceRefresh) {
    const cached = readAuthorizedAdminCache();
    if (cached) return cached;
  }

  const {
    data: { session },
    error: sessionError,
  } = await getSupabaseAuth().auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  const email = normalizeAdminEmail(session?.user?.email ?? '');
  if (!email) {
    clearAuthorizedAdminCache();
    throw new Error('You must be signed in to perform this action.');
  }

  const { data, error } = await getSupabaseAuth()
    .from('admin_users')
    .select('email, role')
    .ilike('email', email)
    .maybeSingle();

  if (error) {
    clearAuthorizedAdminCache();
    throw new Error(error.message);
  }

  if (!data) {
    clearAuthorizedAdminCache();
    throw new Error('This account is not approved for editor access.');
  }

  const actor: AdminActor = {
    email: normalizeAdminEmail(String(data.email ?? email)),
    role: data.role === 'admin' ? 'admin' : 'editor',
  };

  writeAuthorizedAdminCache(actor);
  return actor;
}

export async function runProtectedAdminAction<T>(
  config: RateLimitConfig,
  action: () => PromiseLike<T> | T
): Promise<T> {
  const rateLimit = consumeRateLimit(config);
  if (!rateLimit.allowed) {
    throw new Error(rateLimit.error);
  }

  await getAuthorizedAdmin();
  return await action();
}
