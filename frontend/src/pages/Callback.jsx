import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from "../lib/config";
import { clearCodeVerifier, getCodeVerifier, saveSpotifyToken } from "../lib/auth";
import Loading from "../components/Loading";

async function parseTokenResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { error: text };
  }
}

export default function Callback() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    async function exchangeCodeForToken() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const spotifyError = params.get("error");
      const codeVerifier = getCodeVerifier();

      if (spotifyError) {
        setError(`Spotify authorization failed: ${spotifyError}`);
        return;
      }

      if (!code || !codeVerifier) {
        setError("Missing Spotify authorization code or PKCE verifier. Please connect again.");
        return;
      }

      const body = new URLSearchParams({
        client_id: SPOTIFY_CLIENT_ID,
        grant_type: "authorization_code",
        code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        code_verifier: codeVerifier,
      });

      try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
        });

        const data = await parseTokenResponse(response);

        if (!response.ok) {
          console.log("Spotify token exchange failed:", data);
          setError(data?.error_description || data?.error || "Spotify token exchange failed.");
          return;
        }

        saveSpotifyToken(data);
        clearCodeVerifier();
        navigate("/dashboard", { replace: true });
      } catch (err) {
        console.log("Spotify token exchange request failed:", err);
        setError("Could not reach Spotify to finish login. Check your connection and try again.");
      }
    }

    exchangeCodeForToken();
  }, [navigate]);

  if (!error) {
    return <Loading label="Connecting Spotify..." />;
  }

  return (
    <main className="grid min-h-screen place-items-center bg-black px-6 text-white">
      <section className="w-full max-w-md rounded-[2rem] bg-white/[0.07] p-6 ring-1 ring-white/10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1DB954]">Spotify callback</p>
        <h1 className="mt-4 text-3xl font-black">Connection failed</h1>
        <p className="mt-3 text-sm leading-6 text-white/65">{error}</p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-6 w-full rounded-full bg-[#1DB954] px-5 py-3 font-black text-black"
        >
          Back to Connect
        </button>
      </section>
    </main>
  );
}
