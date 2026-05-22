import { useState } from "react";
import { Link } from "react-router-dom";
import ArtistCard from "../components/ArtistCard";
import RecapCard from "../components/RecapCard";
import SongCard from "../components/SongCard";
import { clearSpotifySession } from "../lib/auth";
import { downloadRecapImage, shareRecap } from "../lib/share";

export default function WeeklyRecap({ recap }) {
  const [shareStatus, setShareStatus] = useState("");

  if (!recap) {
    return null;
  }

  const heroImage = recap.topSong?.image || recap.topArtist?.image;
  const hasRecentSongs = recap.recentSongs.length > 0;
  const hasTopTracks = recap.topTracks.length > 0;
  const hasTopArtists = recap.topArtists.length > 0;

  function disconnectSpotify() {
    clearSpotifySession();
    sessionStorage.removeItem("weekly_recap");
    window.location.assign("/");
  }

  async function handleDownload() {
    setShareStatus("Preparing image...");
    try {
      await downloadRecapImage(recap);
      setShareStatus("Downloaded recap image.");
    } catch (err) {
      console.log("Download recap image failed:", err);
      setShareStatus("Could not download recap image.");
    }
  }

  async function handleShare() {
    setShareStatus("Preparing share...");
    try {
      const message = await shareRecap(recap);
      setShareStatus(message);
    } catch (err) {
      if (err.name === "AbortError") {
        setShareStatus("");
        return;
      }

      console.log("Share recap failed:", err);
      setShareStatus("Could not share recap.");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-8 lg:py-10">
        <header className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
          <section className="relative overflow-hidden rounded-[2rem] bg-[#1DB954] p-6 text-black sm:p-8 lg:min-h-[420px] lg:p-10">
            <div className="relative z-10 flex h-full flex-col justify-between gap-12">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.32em]">VibeRecap</p>
                <h1 className="mt-8 max-w-[11ch] text-[3.4rem] font-black leading-[0.88] tracking-normal sm:text-7xl lg:text-8xl">
                  Your Week in Music
                </h1>
              </div>
              <div className="flex items-end justify-between gap-5">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-black/45">Listener</p>
                  <p className="mt-1 text-xl font-black">{recap.displayName}</p>
                  <button
                    type="button"
                    onClick={disconnectSpotify}
                    className="mt-4 rounded-full bg-black/10 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-black transition hover:bg-black/15"
                  >
                    Disconnect
                  </button>
                </div>
                {heroImage ? (
                  <img
                    src={heroImage}
                    alt=""
                    className="h-24 w-24 rounded-3xl object-cover shadow-2xl sm:h-32 sm:w-32"
                  />
                ) : null}
              </div>
            </div>
          </section>

          <section className="grid gap-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <StatCard label="Minutes" value={recap.estimatedListeningMinutes} tone="light" />
              <StatCard label="Tracks" value={recap.totalTracksAnalyzed} />
              <StatCard label="Discovery" value={`${recap.discoveryScore}%`} />
              <StatCard label="Repeat Rate" value={`${recap.repeatRate}%`} />
            </div>
            <RecapCard
              label="Top Song"
              value={recap.topSong?.name || "Not enough plays yet"}
              subtext={recap.topSong?.artists || "Play more music to fill this in"}
              image={recap.topSong?.image}
            />
            <RecapCard
              label="Top Artist"
              value={recap.topArtist?.name || "Still warming up"}
              subtext={`${recap.uniqueArtists} unique artists this week`}
              image={recap.topArtist?.image}
            />
          </section>
        </header>

        <section className="mt-4 rounded-3xl bg-[#151515] p-4 ring-1 ring-white/10 sm:flex sm:items-center sm:justify-between sm:gap-4">
          <div>
            <p className="text-sm font-black text-white">Share your recap</p>
            <p className="mt-1 text-sm text-white/50">
              Save a polished recap image or share it from your device.
            </p>
            {shareStatus ? <p className="mt-2 text-xs font-bold text-[#1DB954]">{shareStatus}</p> : null}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-0 sm:w-[390px]">
            <button
              type="button"
              onClick={handleDownload}
              className="rounded-full bg-white px-4 py-3 text-sm font-black text-black transition hover:bg-white/90"
            >
              Download
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="rounded-full bg-[#1DB954] px-4 py-3 text-sm font-black text-black transition hover:bg-[#1ed760]"
            >
              Share
            </button>
            <Link
              to="/history"
              className="rounded-full bg-white/10 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-white/15"
            >
              History
            </Link>
          </div>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
          <RecapCard
            label="Music Personality"
            value={recap.musicPersonality}
            subtext="Generated from your recent plays, favorite artists, and short-term top tracks"
            tone="light"
          />
          <RecapCard
            label="Weekly Insight"
            value={recap.artistFocus}
            subtext={recap.insight}
          />
        </section>

        <section className="mt-4">
          <RecapCard
            label="Most Repeated"
            value={recap.mostRepeatedTrack?.name || "No repeats yet"}
            subtext={
              recap.mostRepeatedCount > 1
                ? `${recap.mostRepeatedCount} plays in recent history`
                : "Your recent plays were mostly one-offs"
            }
            image={recap.mostRepeatedTrack?.image}
          />
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <MusicList title="Recently Played" meta="Latest 12">
            {hasRecentSongs ? (
              recap.recentSongs.map((song, index) => (
                <SongCard key={`${song.id || song.name}-${index}`} song={song} index={index} />
              ))
            ) : (
              <EmptyList copy="No recent plays came back from Spotify yet." />
            )}
          </MusicList>

          <div className="grid content-start gap-8">
            <MusicList title="Top Tracks" meta="Short term">
              {hasTopTracks ? (
                recap.topTracks.map((song, index) => (
                  <SongCard key={`${song.id || song.name}-${index}`} song={song} index={index} />
                ))
              ) : (
                <EmptyList copy="Spotify has not built enough short-term top tracks yet." />
              )}
            </MusicList>

            <MusicList title="Top Artists" meta="Short term">
              {hasTopArtists ? (
                recap.topArtists.map((artist, index) => (
                  <ArtistCard key={artist.id || artist.name} artist={artist} index={index} />
                ))
              ) : (
                <EmptyList copy="Spotify has not returned short-term top artists yet." />
              )}
            </MusicList>
          </div>
        </section>
      </section>
    </main>
  );
}

function StatCard({ label, value, tone = "dark", compact = false }) {
  const isLight = tone === "light";

  return (
    <div
      className={[
        "min-h-[116px] rounded-3xl p-5 ring-1",
        isLight ? "bg-white text-black ring-black/5" : "bg-[#151515] text-white ring-white/10",
      ].join(" ")}
    >
      <p className={["text-[11px] font-black uppercase tracking-[0.14em]", isLight ? "text-black/45" : "text-white/45"].join(" ")}>
        {label}
      </p>
      <p className={["mt-5 break-words font-black leading-none", compact ? "text-2xl capitalize" : "text-5xl"].join(" ")}>
        {value}
      </p>
    </div>
  );
}

function MusicList({ title, meta, children }) {
  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-black sm:text-3xl">{title}</h2>
        <span className="shrink-0 text-xs font-black uppercase tracking-[0.12em] text-white/35">{meta}</span>
      </div>
      <div className="grid gap-2.5">{children}</div>
    </section>
  );
}

function EmptyList({ copy }) {
  return (
    <div className="rounded-2xl bg-[#151515] p-5 text-sm font-semibold text-white/50 ring-1 ring-white/10">
      {copy}
    </div>
  );
}
