import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearRecapHistory, getRecapHistory } from "../lib/history";

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function History() {
  const navigate = useNavigate();
  const [version, setVersion] = useState(0);
  const history = useMemo(() => getRecapHistory(), [version]);

  function openRecap(item) {
    sessionStorage.setItem("weekly_recap", JSON.stringify(item.recap));
    navigate(`/recap/${encodeURIComponent(item.id)}`);
  }

  function clearHistory() {
    clearRecapHistory();
    setVersion((current) => current + 1);
  }

  return (
    <main className="min-h-screen bg-black px-4 py-6 text-white sm:px-6">
      <section className="mx-auto w-full max-w-3xl">
        <nav className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white"
          >
            Home
          </button>
          {history.length ? (
            <button
              type="button"
              onClick={clearHistory}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white/70"
            >
              Clear
            </button>
          ) : null}
        </nav>

        <header>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#1DB954]">Recap</p>
          <h1 className="mt-4 text-5xl font-black leading-none sm:text-6xl">Recap History</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/55">
            Recent recaps saved on this device. Spotify tokens are not stored here.
          </p>
        </header>

        <section className="mt-8 grid gap-3">
          {history.length ? (
            history.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openRecap(item)}
                className="rounded-3xl bg-[#151515] p-4 text-left ring-1 ring-white/10 transition hover:bg-[#1b1b1b]"
              >
                <div className="flex gap-4">
                  {item.recap?.topSong?.image ? (
                    <img
                      src={item.recap.topSong.image}
                      alt=""
                      className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="h-20 w-20 shrink-0 rounded-2xl bg-white/10" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#1DB954]">
                      {formatDate(item.savedAt)}
                    </p>
                    <h2 className="mt-2 truncate text-2xl font-black">{item.recap?.musicPersonality}</h2>
                    <p className="mt-1 truncate text-sm text-white/55">
                      {item.recap?.topSong?.name || "Unknown song"} by {item.recap?.topSong?.artists || "Unknown artist"}
                    </p>
                    <p className="mt-2 text-sm font-bold text-white/45">
                      {item.recap?.estimatedListeningMinutes || 0} minutes analyzed
                    </p>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="rounded-3xl bg-[#151515] p-6 ring-1 ring-white/10">
              <h2 className="text-2xl font-black">No saved recaps yet</h2>
              <p className="mt-2 text-sm leading-6 text-white/55">
                Generate a Spotify recap first, then it will appear here automatically.
              </p>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="mt-5 rounded-full bg-[#1DB954] px-5 py-3 text-sm font-black text-black"
              >
                Connect Spotify
              </button>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
