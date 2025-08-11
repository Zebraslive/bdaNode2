async function fetchInventory(steamid) {
  const key = process.env.STEAM_API_KEY;
  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${key}&steamid=${steamid}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch inventory');
  const data = await res.json();
  return data.response;
}

export default function Profile({ user, inventory }) {
  if (!user) return <div className="p-8">Not authenticated</div>;
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Profile</h1>
      <img src={user.photos?.[0]?.value} className="w-24 h-24 rounded" alt="avatar" />
      <p className="mt-2">{user.displayName}</p>
      <pre className="mt-4 bg-gray-200 p-2 rounded text-xs overflow-x-auto">
        {JSON.stringify(user._json, null, 2)}
      </pre>
      <h2 className="text-xl mt-6 mb-2">Steam Inventory</h2>
      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
        {JSON.stringify(inventory, null, 2)}
      </pre>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  if (!req.user) {
    return { redirect: { destination: '/', permanent: false } };
  }
  let inventory = null;
  try {
    inventory = await fetchInventory(req.user._json.steamid);
  } catch (e) {
    inventory = { error: e.message };
  }
  return { props: { user: req.user, inventory } };
}
