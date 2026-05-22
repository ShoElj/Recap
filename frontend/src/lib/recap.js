function firstImage(images) {
  return images?.[0]?.url || "";
}

function countUniqueArtists(tracks) {
  const artists = new Set();

  tracks.forEach((track) => {
    track?.artists?.forEach((artist) => {
      if (artist?.name) {
        artists.add(artist.name);
      }
    });
  });

  return artists.size;
}

function pickTopGenre(artists) {
  const counts = {};

  artists.forEach((artist) => {
    artist.genres?.forEach((genre) => {
      counts[genre] = (counts[genre] || 0) + 1;
    });
  });

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Mixed rotation";
}

function topEntry(counts) {
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || null;
}

function getListeningWindow(plays) {
  const windows = {
    "Late Night": 0,
    Morning: 0,
    Afternoon: 0,
    Evening: 0,
  };

  plays.forEach((item) => {
    const hour = new Date(item.played_at).getHours();

    if (hour < 5) {
      windows["Late Night"] += 1;
    } else if (hour < 12) {
      windows.Morning += 1;
    } else if (hour < 18) {
      windows.Afternoon += 1;
    } else {
      windows.Evening += 1;
    }
  });

  return topEntry(windows)?.[0] || "Anytime";
}

function getRepeatStats(tracks) {
  const counts = {};

  tracks.forEach((track) => {
    const key = track.id || `${track.name}-${track.artists?.[0]?.name || ""}`;
    counts[key] = {
      track,
      count: (counts[key]?.count || 0) + 1,
    };
  });

  const mostRepeated = Object.values(counts).sort((a, b) => b.count - a.count)[0];
  const repeatPlays = Object.values(counts).reduce((sum, item) => {
    return sum + Math.max(item.count - 1, 0);
  }, 0);

  return {
    mostRepeatedTrack: mostRepeated?.track || null,
    mostRepeatedCount: mostRepeated?.count || 0,
    repeatRate: tracks.length ? Math.round((repeatPlays / tracks.length) * 100) : 0,
  };
}

function getArtistFocus(tracks, uniqueArtists) {
  if (!tracks.length || !uniqueArtists) {
    return "No pattern yet";
  }

  const ratio = uniqueArtists / tracks.length;

  if (ratio >= 0.7) {
    return "Wide discovery";
  }

  if (ratio >= 0.4) {
    return "Balanced rotation";
  }

  return "Focused repeat mode";
}

function pickPersonality({
  topGenre,
  uniqueArtists,
  estimatedListeningMinutes,
  repeatRate,
  listeningWindow,
}) {
  const genre = topGenre.toLowerCase();

  if (repeatRate >= 35) {
    return "Repeat Architect";
  }

  if (listeningWindow === "Late Night") {
    return "Midnight Curator";
  }

  if (estimatedListeningMinutes >= 180 && uniqueArtists >= 20) {
    return "Deep Discovery Mode";
  }

  if (estimatedListeningMinutes >= 180) {
    return "Deep Rotation Curator";
  }

  if (uniqueArtists >= 25) {
    return "Wide Range Selector";
  }

  if (genre.includes("pop")) {
    return "Main Character Frequency";
  }

  if (genre.includes("rap") || genre.includes("hip hop")) {
    return "High-Intent Energy";
  }

  if (genre.includes("r&b") || genre.includes("soul")) {
    return "Late Night Selector";
  }

  return "Tastefully Unpredictable";
}

function buildInsight({
  repeatRate,
  listeningWindow,
  artistFocus,
  topSong,
  topArtist,
}) {
  if (repeatRate >= 35 && topSong) {
    return `${topSong.name} carried a lot of your week, with repeat plays shaping the recap.`;
  }

  if (artistFocus === "Wide discovery") {
    return "You spread your listening across a wide set of artists instead of staying in one lane.";
  }

  if (topArtist) {
    return `${topArtist.name} anchored your ${listeningWindow.toLowerCase()} listening window.`;
  }

  return `Your strongest listening window was ${listeningWindow.toLowerCase()}, with a ${artistFocus.toLowerCase()} pattern.`;
}

function normalizeTrack(track) {
  return {
    id: track.id,
    name: track.name,
    artists: track.artists?.map((artist) => artist.name).join(", ") || "Unknown artist",
    album: track.album?.name || "",
    image: firstImage(track.album?.images),
    durationMs: track.duration_ms || 0,
    url: track.external_urls?.spotify || "",
  };
}

function normalizeArtist(artist) {
  return {
    id: artist.id,
    name: artist.name,
    image: firstImage(artist.images),
    genres: artist.genres || [],
    url: artist.external_urls?.spotify || "",
  };
}

export function generateWeeklyRecap({ recentlyPlayed, topTracks, topArtists, profile }) {
  const recentItems = recentlyPlayed?.items || [];
  const recentTracks = recentItems.map((item) => item.track).filter(Boolean);
  const topTrackItems = topTracks?.items || [];
  const topArtistItems = topArtists?.items || [];

  const topSong = topTrackItems[0] || recentTracks[0] || null;
  const topArtistFromRecent = recentTracks
    .flatMap((track) => track.artists || [])
    .reduce((topArtist, artist) => {
      if (!artist?.name) {
        return topArtist;
      }

      const count = (topArtist.counts[artist.name] || 0) + 1;
      topArtist.counts[artist.name] = count;

      if (count > topArtist.count) {
        return { ...topArtist, count, artist };
      }

      return topArtist;
    }, { artist: null, count: 0, counts: {} }).artist;
  const topArtist = topArtistItems[0] || topArtistFromRecent || topSong?.artists?.[0] || null;
  const topGenre = pickTopGenre(topArtistItems);
  const totalDurationMs = recentTracks.reduce((sum, track) => sum + (track.duration_ms || 0), 0);
  const estimatedListeningMinutes = Math.round(totalDurationMs / 60_000);
  const uniqueArtists = countUniqueArtists(recentTracks);
  const listeningWindow = getListeningWindow(recentItems);
  const repeatStats = getRepeatStats(recentTracks);
  const artistFocus = getArtistFocus(recentTracks, uniqueArtists);
  const discoveryScore = recentTracks.length
    ? Math.min(100, Math.round((uniqueArtists / recentTracks.length) * 100))
    : 0;
  const normalizedTopSong = topSong ? normalizeTrack(topSong) : null;
  const normalizedTopArtist = topArtist
    ? {
        name: topArtist.name,
        image: firstImage(topArtist.images),
        genres: topArtist.genres || [],
        url: topArtist.external_urls?.spotify || "",
      }
    : null;
  const normalizedMostRepeatedTrack = repeatStats.mostRepeatedTrack
    ? normalizeTrack(repeatStats.mostRepeatedTrack)
    : null;
  const musicPersonality = pickPersonality({
    topGenre,
    uniqueArtists,
    estimatedListeningMinutes,
    repeatRate: repeatStats.repeatRate,
    listeningWindow,
  });

  return {
    displayName: profile?.display_name || "Listener",
    topSong: normalizedTopSong,
    topArtist: normalizedTopArtist,
    topGenre,
    totalTracksAnalyzed: recentTracks.length,
    uniqueArtists,
    estimatedListeningMinutes,
    listeningWindow,
    artistFocus,
    discoveryScore,
    repeatRate: repeatStats.repeatRate,
    mostRepeatedTrack: normalizedMostRepeatedTrack,
    mostRepeatedCount: repeatStats.mostRepeatedCount,
    insight: buildInsight({
      repeatRate: repeatStats.repeatRate,
      listeningWindow,
      artistFocus,
      topSong: normalizedTopSong,
      topArtist: normalizedTopArtist,
    }),
    recentSongs: recentTracks.slice(0, 12).map(normalizeTrack),
    topTracks: topTrackItems.slice(0, 10).map(normalizeTrack),
    topArtists: topArtistItems.slice(0, 10).map(normalizeArtist),
    musicPersonality,
  };
}
