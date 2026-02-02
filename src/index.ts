type HeadersInit = Record<string, string>;

// Types pour les réponses Grammalecte
export interface GrammarError {
  nStart: number;
  nEnd: number;
  sLineId: string;
  sRuleId: string;
  sRuleType: string;
  sMessage: string;
  aSuggestions: string[];
  aColor?: string[];
  iSeverity?: number;
}

export interface GrammarCheckResponse {
  program: string;
  version: string;
  lang: string;
  error: string;
  data: GrammarError[];
}

export interface GrammarCheckResult {
  data: GrammarError[];
  error: string;
}

export interface GrammarOptions {
  [key: string]: boolean | number | string;
}

interface OptionsResponse {
  values: GrammarOptions;
  labels?: Record<string, any>;
}

interface SpellSuggestion {
  sWord: string;
  aSuggestions: string[];
}

// Client HTTP pour communiquer avec Grammalecte
const GRAMMALECTE_URL =
  (typeof process !== "undefined" && process.env.GRAMMALECTE_URL) ||
  (typeof Bun !== "undefined" && Bun.env.GRAMMALECTE_URL);

if (!GRAMMALECTE_URL) {
  throw new Error("GRAMMALECTE_URL is required.");
}

/**
 * Analyze text for grammar errors
 */
export async function checkGrammar(
  text: string,
  cookies?: string
): Promise<GrammarCheckResult> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (cookies) {
    headers["Cookie"] = cookies;
  }

  const response = await fetch(`${GRAMMALECTE_URL}/gc_text/fr`, {
    method: "POST",
    headers,
    body: JSON.stringify({ sText: text }),
  });

  if (!response.ok) {
    throw new Error(
      `Grammalecte error: ${response.status} ${response.statusText}`
    );
  }

  const apiResponse = (await response.json()) as GrammarCheckResponse;
  return {
    data: apiResponse.data || [],
    error: apiResponse.error || "",
  };
}

/**
 * Get available grammar options for the current user session
 */
export async function getOptions(
  cookies?: string
): Promise<GrammarOptions> {
  const headers: HeadersInit = {};

  if (cookies) {
    headers["Cookie"] = cookies;
  }

  const response = await fetch(`${GRAMMALECTE_URL}/get_options/fr`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(
      `Grammalecte error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json() as OptionsResponse;
  return data.values || {};
}

/**
 * Set grammar options for the current user session
 */
export async function setOptions(
  options: GrammarOptions,
  cookies?: string
): Promise<GrammarOptions> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (cookies) {
    headers["Cookie"] = cookies;
  }

  const response = await fetch(`${GRAMMALECTE_URL}/set_options/fr`, {
    method: "POST",
    headers,
    body: JSON.stringify({ options }),
  });

  if (!response.ok) {
    throw new Error(
      `Grammalecte error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json() as OptionsResponse;
  return data.values || {};
}

/**
 * Reset user options to defaults
 */
export async function resetOptions(cookies?: string): Promise<void> {
  const headers: HeadersInit = {};

  if (cookies) {
    headers["Cookie"] = cookies;
  }

  const response = await fetch(`${GRAMMALECTE_URL}/reset_options/fr`, {
    method: "POST",
    headers,
  });

  if (!response.ok) {
    throw new Error(
      `Grammalecte error: ${response.status} ${response.statusText}`
    );
  }
}

/**
 * Get spelling suggestions for a word
 */
export async function getSpellingSuggestions(
  word: string,
  cookies?: string
): Promise<string[]> {
  const headers: HeadersInit = {};

  if (cookies) {
    headers["Cookie"] = cookies;
  }

  const response = await fetch(`${GRAMMALECTE_URL}/spell_word/fr/${word}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(
      `Grammalecte error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json() as SpellSuggestion;
  return data.aSuggestions;
}
