import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <main className="min-h-screen bg-black px-5 py-8 text-white sm:px-6">
      <article className="mx-auto w-full max-w-3xl">
        <Link to="/" className="text-sm font-black text-[#1DB954] transition hover:text-[#1ed760]">
          Back to VibeRecap
        </Link>

        <header className="mt-10 border-b border-white/10 pb-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#1DB954]">Legal</p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">Terms of Use</h1>
          <p className="mt-3 text-sm font-semibold text-white/45">Last updated: May 2026</p>
        </header>

        <div className="space-y-8 py-8 text-sm leading-7 text-white/70 sm:text-base">
          <section>
            <h2 className="text-xl font-black text-white">Acceptance of Terms</h2>
            <p className="mt-3">
              By using VibeRecap, you agree to these Terms of Use. If you do not agree, do not use the application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white">Use of Spotify Data</h2>
            <p className="mt-3">
              VibeRecap uses Spotify authentication to access the permissions you grant, including profile, recently
              played, top tracks, and top artists data. This data is used to generate personal recap experiences.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white">User Responsibilities</h2>
            <p className="mt-3">
              You are responsible for your Spotify account, your device, and any activity that occurs through your use
              of VibeRecap.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white">No Warranty</h2>
            <p className="mt-3">
              VibeRecap is provided as-is. We do not guarantee uninterrupted availability, error-free operation, or that
              generated recap insights will always be complete or accurate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white">Third-Party Services</h2>
            <p className="mt-3">
              VibeRecap depends on Spotify Web API and Vercel Hosting. Your use of those services may also be governed
              by their own terms and policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white">Changes to These Terms</h2>
            <p className="mt-3">
              These terms may be updated periodically. Continued use of VibeRecap after changes are posted means you
              accept the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white">Contact</h2>
            <p className="mt-3">For questions regarding these Terms:</p>
            <p className="mt-3">
              Email:{" "}
              <a href="mailto:shodipoelijah4@gmail.com" className="font-bold text-[#1DB954] hover:text-[#1ed760]">
                shodipoelijah4@gmail.com
              </a>
            </p>
            <p>
              GitHub:{" "}
              <a
                href="https://github.com/ShoElj/Recap"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#1DB954] hover:text-[#1ed760]"
              >
                github.com/ShoElj/Recap
              </a>
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
