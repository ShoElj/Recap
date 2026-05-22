export default function RecapCard({ label, value, subtext, image, tone = "dark" }) {
  const isLight = tone === "light";

  return (
    <section
      className={[
        "rounded-3xl p-5 ring-1 transition",
        isLight
          ? "bg-white text-black ring-black/5"
          : "bg-[#151515] text-white ring-white/10 hover:bg-[#191919]",
      ].join(" ")}
    >
      <p
        className={[
          "mb-4 text-[11px] font-black uppercase tracking-[0.22em]",
          isLight ? "text-black/50" : "text-[#1DB954]",
        ].join(" ")}
      >
        {label}
      </p>
      <div className="flex items-center gap-4">
        {image ? <img src={image} alt="" className="h-16 w-16 shrink-0 rounded-2xl object-cover" /> : null}
        <div className="min-w-0">
          <h2 className="break-words text-[1.65rem] font-black leading-[1.02]">{value}</h2>
          {subtext ? (
            <p className={["mt-2 text-sm leading-5", isLight ? "text-black/55" : "text-white/55"].join(" ")}>
              {subtext}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
