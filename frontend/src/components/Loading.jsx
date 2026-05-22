export default function Loading({ label = "Building your recap..." }) {
  return (
    <div className="min-h-screen bg-black text-white grid place-items-center px-6">
      <div className="text-center">
        <div className="mx-auto mb-5 h-12 w-12 rounded-full border-4 border-white/10 border-t-[#1DB954] animate-spin" />
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#1DB954]">{label}</p>
      </div>
    </div>
  );
}
