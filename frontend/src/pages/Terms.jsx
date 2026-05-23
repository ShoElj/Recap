import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <main className="min-h-screen bg-black px-5 py-8 text-white sm:px-6">
      <article className="mx-auto w-full max-w-3xl">
        <Link to="/" className="text-sm font-black text-[#1DB954] transition hover:text-[#1ed760]">
          Back to Recap
        </Link>

        <header className="mt-10 border-b border-white/10 pb-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#1DB954]">Legal</p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">Terms of Service</h1>
          <p className="mt-3 text-sm font-semibold text-white/45">Last updated: May 2026</p>
        </header>

        <div className="space-y-8 py-8 text-sm leading-7 text-white/70 sm:text-base">
          <section>
            <h2 className="text-xl font-black text-white">Acceptance of Terms</h2>
            <p className="mt-3">
              By accessing or using Recap, you agree to these Terms of Service.
            </p>
            <p className="mt-3">
              If you do not agree with any part of these terms, you should not use the application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white">Description of Service</h2>
            <p className="mt-3">
              Recap is a music recap application that connects with Spotify to generate personalized listening summaries
              and statistics.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white">Spotify Integration</h2>
            <p className="mt-3">
              Recap uses Spotify APIs and is not affiliated with or endorsed by Spotify.
            </p>
            <p className="mt-3">
              Users are responsible for complying with Spotify's terms and policies while using the application.
            </p>
            <a
              href="https://www.spotify.com/legal/end-user-agreement/"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block font-bold text-[#1DB954] transition hover:text-[#1ed760]"
            >
              Spotify Terms
            </a>
          </section>

          <section>
            <h2 className="text-xl font-black text-white">User Responsibilities</h2>
            <p className="mt-3">You agree not to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Abuse or misuse the service</li>
              <li>Attempt unauthorized access</li>
              <li>Reverse engineer the application</li>
              <li>Use Recap for unlawful purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-white">Availability</h2>
            <p className="mt-3">Recap is provided "as is" without guarantees of uninterrupted availability or accuracy.</p>
            <p className="mt-3">Features may change, be updated, or removed at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white">Limitation of Liability</h2>
            <p className="mt-3">Recap and its developers are not liable for:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Data loss</li>
              <li>Service interruptions</li>
              <li>Third-party API issues</li>
              <li>Indirect or incidental damages</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-white">Intellectual Property</h2>
            <p className="mt-3">
              All branding, design, and original application content belong to the Recap project and its creators.
            </p>
            <p className="mt-3">Spotify trademarks and assets belong to Spotify.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white">Termination</h2>
            <p className="mt-3">Access to Recap may be suspended or terminated if users violate these terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white">Changes to Terms</h2>
            <p className="mt-3">
              These Terms may be updated periodically. Continued use of the app means you accept the updated terms.
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
