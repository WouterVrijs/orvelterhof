/**
 * API client for the external booking system.
 *
 * All communication with the booking system goes through this client.
 * It handles authentication, timeouts, error mapping, and logging.
 *
 * Configuration via environment variables:
 * - BOOKING_API_URL: Base URL of the booking system API
 * - BOOKING_API_KEY: API key for authentication (sent as Bearer token)
 *
 * When BOOKING_API_URL is not set, the caller should fall back to mock data.
 * Use `isApiConfigured()` to check before calling.
 */

// ── Configuration ────────────────────────────────────────────────

const DEFAULT_TIMEOUT_MS = 10_000;

export function isApiConfigured(): boolean {
  return !!process.env.BOOKING_API_URL;
}

function getBaseUrl(): string {
  const url = process.env.BOOKING_API_URL;
  if (!url) throw new Error("[api:booking] BOOKING_API_URL is not configured");
  // Strip trailing slash
  return url.replace(/\/+$/, "");
}

function getApiKey(): string | undefined {
  return process.env.BOOKING_API_KEY;
}

// ── Error types ──────────────────────────────────────────────────

export class BookingApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number | null,
    public readonly isTimeout: boolean = false,
  ) {
    super(message);
    this.name = "BookingApiError";
  }
}

// ── Fetch wrapper ────────────────────────────────────────────────

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  timeoutMs?: number;
}

/**
 * Make an authenticated request to the booking system API.
 *
 * @param path - API path (e.g. "/bookings")
 * @param options - HTTP method, body, and timeout
 * @returns Parsed JSON response
 * @throws BookingApiError on network, timeout, or HTTP errors
 */
export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { method = "GET", body, timeoutMs = DEFAULT_TIMEOUT_MS } = options;
  const url = `${getBaseUrl()}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const apiKey = getApiKey();
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (!response.ok) {
      // Try to parse error body for a message
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorBody = await response.json();
        if (typeof errorBody?.message === "string") {
          errorMessage = errorBody.message;
        }
      } catch {
        // No parseable error body — use status text
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }

      // Log as warning (not error) for 404s — endpoint may not exist yet
      const logFn = response.status === 404 ? console.warn : console.error;
      logFn(
        `[api:booking] ${method} ${path} failed:`,
        { status: response.status, message: errorMessage },
      );

      throw new BookingApiError(errorMessage, response.status);
    }

    const data = (await response.json()) as T;
    return data;
  } catch (error) {
    if (error instanceof BookingApiError) throw error;

    // AbortController timeout
    if (error instanceof DOMException && error.name === "AbortError") {
      console.error(
        `[api:booking] ${method} ${path} timed out after ${timeoutMs}ms`,
      );
      throw new BookingApiError(
        "Het boekingssysteem reageert niet. Probeer het later opnieuw.",
        null,
        true,
      );
    }

    // Network error
    console.error(`[api:booking] ${method} ${path} network error:`, error);
    throw new BookingApiError(
      "Kan het boekingssysteem niet bereiken. Controleer uw verbinding.",
      null,
    );
  } finally {
    clearTimeout(timeout);
  }
}
