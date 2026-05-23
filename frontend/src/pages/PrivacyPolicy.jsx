import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-black px-5 py-8 text-white sm:px-6">
      <article className="mx-auto w-full max-w-3xl">
        <Link to="/" className="text-sm font-black text-[#1DB954] transition hover:text-[#1ed760]">
          Back to VibeRecap
        </Link>

        <header className="mt-10 border-b border-white/10 pb-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#1DB954]">Legal</p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">Privacy Policy</h1>
          <p className="mt-3 text-sm font-semibold text-white/45">Last updated: May 2026</p>
        </header>

        <div className="space-y-8 py-8 text-sm leading-7 text-white/70 sm:text-base">
          <section>
            <h2 className="text-xl font-black text-white">Introduction</h2>
            <p className="mt-3">
              Recap respects your privacy. This application is designed to help users generate personalized music
              listening recaps using Spotify data.
            </p>
            <p className="mt-3">
              By using Recap, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white">Information We Access</h2>
            <p className="mt-3">When you connect your Spotify account, Recap may access:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Your Spotify profile information</li>
              <li>Recently played tracks</li>
              <li>Top tracks and artists</li>
              <li>Listening statistics</li>
              <li>Public account information</li>
            </ul>
            <p className="mt-3">
              Recap only accesses the permissions explicitly granted by you through Spotify authentication.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white">How We Use Your Data</h2>
            <p className="mt-3">Your Spotify data is used solely to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Generate personalized music recap experiences</li>
              <li>Display listening statistics</li>
              <li>Create recap cards and insights</li>
              <li>Improve app functionality and user experience</li>
            </ul>
            <p className="mt-3">We do not sell, rent, or share your personal Spotify data with third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white">Data Storage</h2>
            <p className="mt-3">Recap does not permanently store Spotify access tokens on external servers.</p>
            <p className="mt-3">
              Some recap information may be stored locally on your device for performance and history features.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white">Third-Party Services</h2>
            <p className="mt-3">Recap uses third-party services including:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Spotify Web API</li>
              <li>Vercel Hosting</li>
            </ul>
            <p className="mt-3">These services may process data according to their own privacy policies.</p>
            <a
              href="https://www.spotify.com/legal/privacy-policy/"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block font-bold text-[#1DB954] transition hover:text-[#1ed760]"
            >
              Spotify Privacy Policy
            </a>
          </section>

          <section>
            <h2 className="text-xl font-black text-white">Security</h2>
            <p className="mt-3">We take reasonable measures to protect your information and authentication data.</p>
            <p className="mt-3">However, no internet transmission or storage method is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white">Children's Privacy</h2>
            <p className="mt-3">Recap is not intended for children under 13 years old.</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white">Changes to This Policy</h2>
            <p className="mt-3">
              This Privacy Policy may be updated periodically. Changes will be reflected on this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-white">Contact</h2>
            <p className="mt-3">For questions regarding this Privacy Policy:</p>
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
