import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallEvent(event);
      setHidden(false);
    };

    const onAppInstalled = () => {
      setInstallEvent(null);
      setHidden(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installEvent) return;

    await installEvent.prompt();
    await installEvent.userChoice;

    setInstallEvent(null);
    setHidden(true);
  };

  if (!installEvent || hidden) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-xl border border-zinc-700 bg-zinc-900/95 p-4 shadow-2xl backdrop-blur">
      <p className="text-sm font-medium text-white">Install Recap</p>
      <p className="mt-1 text-xs text-zinc-300">
        Add Recap to your home screen for a faster app-like experience.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={handleInstall}
          className="rounded-md bg-green-500 px-3 py-2 text-xs font-semibold text-black transition hover:bg-green-400"
        >
          Install
        </button>
        <button
          type="button"
          onClick={() => {
            setHidden(true);
            setInstallEvent(null);
          }}
          className="rounded-md border border-zinc-600 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-zinc-400"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
