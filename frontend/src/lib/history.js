const HISTORY_KEY = "viberecap_history";
const MAX_HISTORY_ITEMS = 8;

function readHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getRecapHistory() {
  return readHistory();
}

export function saveRecapToHistory(recap) {
  const savedAt = new Date().toISOString();
  const id = `${savedAt}-${recap.displayName || "listener"}`;
  const nextItem = {
    id,
    savedAt,
    recap,
  };
  const existing = readHistory().filter((item) => {
    return item.recap?.displayName !== recap.displayName || item.recap?.topSong?.name !== recap.topSong?.name;
  });

  writeHistory([nextItem, ...existing].slice(0, MAX_HISTORY_ITEMS));
  return nextItem;
}

export function getRecapHistoryItem(id) {
  return readHistory().find((item) => item.id === id) || null;
}

export function clearRecapHistory() {
  localStorage.removeItem(HISTORY_KEY);
}
