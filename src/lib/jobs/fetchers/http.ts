const DEFAULT_USER_AGENT = "NextStepMM-Ingest/0.1 (+https://nextstep-mm.local; rate-limited; research)";

export async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchText(
  url: string,
  options?: {
    headers?: Record<string, string>;
    timeoutMs?: number;
  },
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options?.timeoutMs ?? 25_000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "User-Agent": DEFAULT_USER_AGENT,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Fetch failed (${response.status}) for ${url}`);
    }

    return response.text();
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchJson<T>(
  url: string,
  options?: {
    headers?: Record<string, string>;
    timeoutMs?: number;
  },
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options?.timeoutMs ?? 25_000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": DEFAULT_USER_AGENT,
        ...options?.headers,
      },
    });

    const payload = (await response.json()) as T & {
      meta?: { success?: boolean; message?: string };
    };

    if (!response.ok) {
      throw new Error(`Fetch failed (${response.status}) for ${url}`);
    }

    if (payload && typeof payload === "object" && "meta" in payload && payload.meta?.success === false) {
      throw new Error(payload.meta.message ?? `API error for ${url}`);
    }

    return payload;
  } finally {
    clearTimeout(timeout);
  }
}
