export async function readResponseBody(res) {
  const text = await res.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return {
      raw: text,
      message: text,
    };
  }
}

export function extractErrorMessage(payload, fallback = "Something went wrong.") {
  if (typeof payload === "string" && payload.trim()) {
    return payload.trim();
  }

  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const candidates = [
    payload.error,
    payload.message,
    payload.details,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return fallback;
}

export function extractList(payload, key = "data") {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.[key])) {
    return payload[key];
  }

  return [];
}

export function getErrorMessage(error, fallback = "Something went wrong.") {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export async function parseResponseOrThrow(
  res,
  fallback = "Request failed."
) {
  const data = await readResponseBody(res);

  if (!res.ok) {
    throw new Error(extractErrorMessage(data, fallback));
  }

  return data;
}
