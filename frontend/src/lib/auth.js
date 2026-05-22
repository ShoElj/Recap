import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI, SPOTIFY_SCOPES } from "./config";

const CODE_VERIFIER_KEY = "spotify_code_verifier";
const SPOTIFY_TOKEN_KEYS = [
  "spotify_access_token",
  "spotify_refresh_token",
  "spotify_expires_in",
  "spotify_token_timestamp",
];

function base64UrlEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function generateRandomString(length = 96) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  return Array.from(randomValues, (value) => chars[value % chars.length]).join("");
}

async function createCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(digest);
}

export async function loginWithSpotify() {
  clearSpotifySession();

  const codeVerifier = generateRandomString();
  const codeChallenge = await createCodeChallenge(codeVerifier);

  sessionStorage.setItem(CODE_VERIFIER_KEY, codeVerifier);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: SPOTIFY_CLIENT_ID,
    scope: SPOTIFY_SCOPES.join(" "),
    redirect_uri: SPOTIFY_REDIRECT_URI,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  });

  window.location.assign(`https://accounts.spotify.com/authorize?${params.toString()}`);
}

export function getCodeVerifier() {
  return sessionStorage.getItem(CODE_VERIFIER_KEY);
}

export function clearCodeVerifier() {
  sessionStorage.removeItem(CODE_VERIFIER_KEY);
  localStorage.removeItem(CODE_VERIFIER_KEY);
}

export function saveSpotifyToken(tokenData) {
  clearStoredSpotifyTokens();

  sessionStorage.setItem("spotify_access_token", tokenData.access_token);
  sessionStorage.setItem("spotify_token_timestamp", String(Date.now()));

  if (tokenData.refresh_token) {
    sessionStorage.setItem("spotify_refresh_token", tokenData.refresh_token);
  }

  if (tokenData.expires_in) {
    sessionStorage.setItem("spotify_expires_in", String(tokenData.expires_in));
  }
}

export function clearSpotifySession() {
  clearStoredSpotifyTokens();
  clearCodeVerifier();
}

function clearStoredSpotifyTokens() {
  SPOTIFY_TOKEN_KEYS.forEach((key) => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  });
}
