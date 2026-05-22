export default function SongCard({ song, index }) {
  if (!song) {
    return null;
  }

  return (
    <a
      href={song.url || undefined}
      target={song.url ? "_blank" : undefined}
      rel="noreferrer"
      className="group flex min-h-[76px] items-center gap-3 rounded-2xl bg-[#151515] p-3 ring-1 ring-white/10 transition hover:bg-[#1b1b1b]"
    >
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#1DB954] text-xs font-black text-black">
        {index + 1}
      </div>
      {song.image ? (
        <img src={song.image} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
      ) : (
        <div className="h-14 w-14 shrink-0 rounded-xl bg-white/10" />
      )}
      <div className="min-w-0">
        <p className="truncate text-[15px] font-black leading-5 text-white">{song.name}</p>
        <p className="mt-1 truncate text-sm text-white/50">{song.artists}</p>
      </div>
    </a>
  );
}
