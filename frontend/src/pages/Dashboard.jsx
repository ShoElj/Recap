import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import WeeklyRecap from "./WeeklyRecap";
import { loginWithSpotify } from "../lib/auth";
import { saveRecapToHistory } from "../lib/history";
import { generateWeeklyRecap } from "../lib/recap";
import { getAccessToken, getProfile, getRecentlyPlayed, getTopArtists, getTopTracks } from "../lib/spotify";

export default function Dashboard() {
  const navigate = useNavigate();
  const [recap, setRecap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecap() {
      if (!getAccessToken()) {
        setLoading(false);
        return;
      }

      try {
        setError("");
        const [profile, recentlyPlayed, topTracks, topArtists] = await Promise.all([
          getProfile(),
          getRecentlyPlayed(),
          getTopTracks(),
          getTopArtists(),
        ]);

        const nextRecap = generateWeeklyRecap({
          profile,
          recentlyPlayed,
          topTracks,
          topArtists,
        });

        setRecap(nextRecap);
        sessionStorage.setItem("weekly_recap", JSON.stringify(nextRecap));
        saveRecapToHistory(nextRecap);
      } catch (err) {
        console.log("Dashboard recap error:", err);
        setError(err.message || "Could not load your Spotify recap.");
      } finally {
        setLoading(false);
      }
    }

    loadRecap();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!getAccessToken()) {
    return (
      <main className="grid min-h-screen place-items-center bg-black px-6 text-white">
        <section className="w-full max-w-md rounded-[2rem] bg-white/[0.07] p-6 ring-1 ring-white/10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1DB954]">Spotify required</p>
          <h1 className="mt-4 text-3xl font-black">Connect Spotify first</h1>
          <p className="mt-3 text-sm leading-6 text-white/65">
            Recap needs Spotify access to build your weekly recap.
          </p>
          <button
            type="button"
            onClick={loginWithSpotify}
            className="mt-6 w-full rounded-full bg-[#1DB954] px-5 py-3 font-black text-black"
          >
            Connect Spotify
          </button>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-black px-6 text-white">
        <section className="w-full max-w-md rounded-[2rem] bg-white/[0.07] p-6 ring-1 ring-white/10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1DB954]">Dashboard</p>
          <h1 className="mt-4 text-3xl font-black">Could not build recap</h1>
          <p className="mt-3 text-sm leading-6 text-white/65">{error}</p>
          <div className="mt-6 grid gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full rounded-full bg-[#1DB954] px-5 py-3 font-black text-black"
            >
              Try Again
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full rounded-full bg-white/10 px-5 py-3 font-black text-white"
            >
              Back Home
            </button>
          </div>
        </section>
      </main>
    );
  }

  return <WeeklyRecap recap={recap} />;
}
