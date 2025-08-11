// Simple helpers to interact with the Steam Web API.
// In production you would expand this to fetch profile, inventory, etc.

export async function fetchProfile(steamid) {
  const key = process.env.STEAM_API_KEY;
  const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${key}&steamids=${steamid}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch profile');
  const data = await res.json();
  return data.response.players[0];
}

export async function fetchInventory(steamid) {
  const key = process.env.STEAM_API_KEY;
  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${key}&steamid=${steamid}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch inventory');
  const data = await res.json();
  return data.response;
}
