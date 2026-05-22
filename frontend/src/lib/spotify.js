import { SPOTIFY_CLIENT_ID } from "./config";
import { saveSpotifyToken } from "./auth";

const API_BASE = "https://api.spotify.com/v1";
const TOKEN_URL = "https://accounts.spotify.com/api/token";

async function parseSpotifyResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { error: { message: text } };
  }
}

function spotifyErrorMessage(data, fallback) {
  if (!data) {
    return fallback;
  }

  if (typeof data.error === "string") {
    return data.error_description || data.error;
  }

  return data.error?.message || data.error_description || fallback;
}

export function getAccessToken() {
  return sessionStorage.getItem("spotify_access_token");
}

function getRefreshToken() {
  return sessionStorage.getItem("spotify_refresh_token");
}

function isTokenExpired() {
  const timestamp = Number(sessionStorage.getItem("spotify_token_timestamp"));
  const expiresIn = Number(sessionStorage.getItem("spotify_expires_in"));

  if (!timestamp || !expiresIn) {
    return false;
  }

  return Date.now() > timestamp + expiresIn * 1000 - 60_000;
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("Spotify session expired. Please connect Spotify again.");
  }

  const body = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const data = await parseSpotifyResponse(response);

  if (!response.ok) {
    console.log("Spotify refresh token error:", data);
    throw new Error(spotifyErrorMessage(data, "Could not refresh Spotify session."));
  }

  saveSpotifyToken({
    ...data,
    refresh_token: data.refresh_token || refreshToken,
  });

  return data.access_token;
}

async function getUsableAccessToken() {
  if (isTokenExpired()) {
    return refreshAccessToken();
  }

  const token = getAccessToken();
  if (!token) {
    throw new Error("No Spotify access token found.");
  }

  return token;
}

export async function spotifyFetch(endpoint) {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  let token = await getUsableAccessToken();

  let response = await fetch(`${API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401 && getRefreshToken()) {
    token = await refreshAccessToken();
    response = await fetch(`${API_BASE}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const data = await parseSpotifyResponse(response);

  if (!response.ok) {
    console.log("Spotify API error:", data);
    const message = spotifyErrorMessage(data, "Spotify API request failed.");
    throw new Error(`${message} (${response.status} ${path})`);
  }

  return data;
}

export function getProfile() {
  return spotifyFetch("/me");
}

export function getRecentlyPlayed() {
  return spotifyFetch("/me/player/recently-played?limit=50");
}

export function getTopTracks() {
  return spotifyFetch("/me/top/tracks?limit=10&time_range=short_term");
}

export function getTopArtists() {
  return spotifyFetch("/me/top/artists?limit=10&time_range=short_term");
}
