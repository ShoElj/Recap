export const SPOTIFY_CLIENT_ID =
  import.meta.env.VITE_SPOTIFY_CLIENT_ID || "7176e46b2f424a36b518db757456a8ce";

export const SPOTIFY_REDIRECT_URI =
  import.meta.env.VITE_SPOTIFY_REDIRECT_URI || "http://127.0.0.1:5173/callback";

export const SPOTIFY_SCOPES = [
  "user-read-recently-played",
  "user-top-read",
  "user-read-private",
];
