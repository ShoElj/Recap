import { Link } from "react-router-dom";
import { loginWithSpotify } from "../lib/auth";
import { getRecapHistory } from "../lib/history";

export default function Landing() {
  const hasHistory = getRecapHistory().length > 0;

  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-between px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#1DB954]" />
            <span className="text-lg font-black">VibeRecap</span>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70">
            Spotify MVP
          </span>
        </nav>

        <div className="py-16">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-[#1DB954]">
            Weekly music recap
          </p>
          <h1 className="text-6xl font-black leading-[0.9] tracking-normal">
            Your week, scored.
          </h1>
          <p className="mt-6 max-w-sm text-lg leading-7 text-white/65">
            Connect Spotify to turn your recent plays, top tracks, and favorite artists into a polished weekly recap.
          </p>
        </div>

        <div>
          <div className="space-y-4">
            <button
              type="button"
              onClick={loginWithSpotify}
              className="w-full rounded-full bg-[#1DB954] px-6 py-4 text-base font-black text-black shadow-glow transition hover:scale-[1.01] active:scale-[0.99]"
            >
              Connect Spotify
            </button>
            {hasHistory ? (
              <Link
                to="/history"
                className="block w-full rounded-full bg-white/10 px-6 py-4 text-center text-base font-black text-white transition hover:bg-white/15"
              >
                View Recap History
              </Link>
            ) : null}
            <p className="text-center text-xs leading-5 text-white/45">
              Uses Spotify PKCE auth. No client secret.
            </p>
          </div>

          <footer className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-bold text-white/45">
            <Link to="/privacy-policy" className="transition hover:text-white">
              Privacy
            </Link>
            <Link to="/terms" className="transition hover:text-white">
              Terms
            </Link>
            <a
              href="https://github.com/ShoElj/Recap"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-[#1DB954]"
            >
              Star on GitHub
            </a>
          </footer>
        </div>
      </section>
    </main>
  );
}
