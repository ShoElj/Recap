const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1920;
const GREEN = "#1DB954";
const BLACK = "#050505";
const PANEL = "#151515";
const WHITE = "#FFFFFF";
const MUTED = "rgba(255, 255, 255, 0.64)";

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function fillRoundRect(ctx, x, y, width, height, radius, fillStyle) {
  roundedRect(ctx, x, y, width, height, radius);
  ctx.fillStyle = fillStyle;
  ctx.fill();
}

function drawLabel(ctx, text, x, y, color = GREEN) {
  ctx.fillStyle = color;
  ctx.font = "900 28px Arial";
  ctx.letterSpacing = "8px";
  ctx.fillText(text.toUpperCase(), x, y);
  ctx.letterSpacing = "0px";
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = String(text || "").split(/\s+/);
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });

  if (line) {
    lines.push(line);
  }

  lines.slice(0, maxLines).forEach((currentLine, index) => {
    const suffix = index === maxLines - 1 && lines.length > maxLines ? "..." : "";
    ctx.fillText(`${currentLine}${suffix}`, x, y + index * lineHeight);
  });
}

function drawStat(ctx, label, value, x, y, width, light = false) {
  fillRoundRect(ctx, x, y, width, 176, 42, light ? WHITE : PANEL);
  ctx.fillStyle = light ? "rgba(0, 0, 0, 0.48)" : "rgba(255, 255, 255, 0.48)";
  ctx.font = "900 27px Arial";
  ctx.fillText(label.toUpperCase(), x + 36, y + 58);
  ctx.fillStyle = light ? BLACK : WHITE;
  ctx.font = "900 76px Arial";
  drawWrappedText(ctx, value, x + 36, y + 138, width - 72, 76, 1);
}

function drawHighlight(ctx, label, value, subtext, x, y) {
  fillRoundRect(ctx, x, y, 920, 190, 48, PANEL);
  drawLabel(ctx, label, x + 42, y + 58);
  ctx.fillStyle = WHITE;
  ctx.font = "900 50px Arial";
  drawWrappedText(ctx, value, x + 42, y + 118, 820, 54, 1);
  ctx.fillStyle = MUTED;
  ctx.font = "700 30px Arial";
  drawWrappedText(ctx, subtext, x + 42, y + 160, 820, 34, 1);
}

function drawTrackList(ctx, title, tracks, x, y) {
  ctx.fillStyle = WHITE;
  ctx.font = "900 46px Arial";
  ctx.fillText(title, x, y);

  tracks.slice(0, 2).forEach((track, index) => {
    const rowY = y + 40 + index * 100;
    fillRoundRect(ctx, x, rowY, 920, 82, 28, PANEL);
    ctx.fillStyle = GREEN;
    ctx.beginPath();
    ctx.arc(x + 46, rowY + 41, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = BLACK;
    ctx.font = "900 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(String(index + 1), x + 46, rowY + 50);
    ctx.textAlign = "left";
    ctx.fillStyle = WHITE;
    ctx.font = "900 30px Arial";
    drawWrappedText(ctx, track.name, x + 92, rowY + 34, 750, 32, 1);
    ctx.fillStyle = MUTED;
    ctx.font = "700 24px Arial";
    drawWrappedText(ctx, track.artists, x + 92, rowY + 64, 750, 28, 1);
  });
}

function canvasToBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, "image/png", 0.95);
  });
}

export async function createRecapImageBlob(recap) {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = BLACK;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  fillRoundRect(ctx, 80, 80, 920, 360, 64, GREEN);
  ctx.fillStyle = BLACK;
  ctx.font = "900 28px Arial";
  ctx.fillText("Recap", 126, 150);
  ctx.font = "900 102px Arial";
  drawWrappedText(ctx, "Your Week in Music", 126, 270, 760, 98, 2);
  ctx.font = "900 34px Arial";
  ctx.fillText(recap.displayName, 126, 384);

  drawStat(ctx, "Minutes", String(recap.estimatedListeningMinutes), 80, 480, 445, true);
  drawStat(ctx, "Discovery", `${recap.discoveryScore || 0}%`, 555, 480, 445);

  drawHighlight(ctx, "Top Song", recap.topSong?.name || "Not enough plays yet", recap.topSong?.artists || "", 80, 710);
  drawHighlight(ctx, "Top Artist", recap.topArtist?.name || "Still warming up", `${recap.uniqueArtists} unique artists`, 80, 930);
  drawHighlight(ctx, "Music Personality", recap.musicPersonality, recap.insight || recap.topGenre, 80, 1150);
  drawHighlight(ctx, "Listening Window", recap.listeningWindow || "Anytime", `${recap.repeatRate || 0}% repeat rate`, 80, 1370);

  drawTrackList(ctx, "Top Tracks", recap.topTracks || [], 80, 1630);

  ctx.fillStyle = "rgba(255, 255, 255, 0.42)";
  ctx.font = "700 24px Arial";
  ctx.fillText("Generated with Recap", 80, 1872);

  return canvasToBlob(canvas);
}

export async function downloadRecapImage(recap) {
  const blob = await createRecapImageBlob(recap);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Recap-weekly-recap.png";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function shareRecap(recap) {
  const shareText = `My Recap: ${recap.estimatedListeningMinutes} estimated minutes, ${recap.musicPersonality}, top song ${recap.topSong?.name || "unknown"}.`;

  if (!navigator.share) {
    await navigator.clipboard.writeText(shareText);
    return "Copied recap text to clipboard.";
  }

  const blob = await createRecapImageBlob(recap);
  const file = new File([blob], "Recap-weekly-recap.png", { type: "image/png" });

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      title: "My Recap",
      text: shareText,
      files: [file],
    });
    return "Shared recap.";
  }

  await navigator.share({
    title: "My Recap",
    text: shareText,
  });
  return "Shared recap.";
}
