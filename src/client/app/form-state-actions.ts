import { isValid } from "date-fns";

export async function importDecklist(_prevState, queryData) {
  const decklist = queryData.get("decklist");
  const sortType = queryData.get("sortType");
  const response = await fetch("/api/v1/decklist/import", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ decklist, sortType }),
  });
  const deck = await response.json();
  return deck;
}

export async function generatePdf(_prevState, queryData) {
  const playerName = queryData.get("playerName");
  const playerId = queryData.get("playerId");
  const playerDob = queryData.get("playerDob");
  const format = queryData.get("format");
  const deck = JSON.parse(queryData.get("deck"));
  if (!playerName || !playerId || !playerDob || !format || !deck) {
    return {
      blob: null,
      error: "Missing required fields",
    };
  }

  if (!isValid(new Date(playerDob))) {
    return {
      blob: null,
      error: "Invalid date of birth",
    };
  }

  const dto = {
    playerName,
    playerId,
    playerDob,
    format,
    ...deck,
  };
  const response = await fetch("/api/v1/deck/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto),
  });
  if (response.status !== 200) {
    console.error(response.statusText);
    return {
      blob: null,
      error: response.statusText,
    };
  }
  const blob = await response.blob();
  return {
    blob,
    error: null
  };
}
