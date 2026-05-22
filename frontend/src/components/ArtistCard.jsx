export default function ArtistCard({ artist, index }) {
  if (!artist) {
    return null;
  }

  return (
    <a
      href={artist.url || undefined}
      target={artist.url ? "_blank" : undefined}
      rel="noreferrer"
      className="flex min-h-[76px] items-center gap-3 rounded-2xl bg-[#151515] p-3 ring-1 ring-white/10 transition hover:bg-[#1b1b1b]"
    >
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-black text-white">
        {index + 1}
      </div>
      {artist.image ? (
        <img src={artist.image} alt="" className="h-14 w-14 shrink-0 rounded-full object-cover" />
      ) : (
        <div className="h-14 w-14 shrink-0 rounded-full bg-white/10" />
      )}
      <div className="min-w-0">
        <p className="truncate text-[15px] font-black leading-5 text-white">{artist.name}</p>
        <p className="mt-1 truncate text-sm capitalize text-white/50">
          {artist.genres?.[0] || "artist"}
        </p>
      </div>
    </a>
  );
}
