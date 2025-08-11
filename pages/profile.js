async function fetchInventory(steamid) {
  const key = process.env.STEAM_API_KEY;
  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${key}&steamid=${steamid}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch inventory');
  const data = await res.json();
  return data.response;
}

async function fetchEmojis(steamid) {
  const url = `https://steamcommunity.com/inventory/${steamid}/753/6?l=english&count=2000`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch emoji inventory');
  const data = await res.json();
  // Parse emoji descriptions and tags
  if (!Array.isArray(data.descriptions)) return [];
  return data.descriptions.map(desc => ({
    icon: desc.icon_url,
    title: desc.descriptions?.[0]?.value || '',
    tags: Array.isArray(desc.tags)
      ? desc.tags.map(tag => tag.localized_tag_name)
      : [],
  })).filter(e => e.icon);
}

async function testMiniProfileBackground(steamid) {
  const key = process.env.STEAM_API_KEY;
  const url = `https://api.steampowered.com/IPlayerService/GetMiniProfileBackground/v1/?key=${key}&steamid=${steamid}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch mini profile background');
  const data = await res.json();

  return 'https://shared.fastly.steamstatic.com/community_assets/images/'+data.response.profile_background.movie_webm;
}

export default function Profile({ user, inventory, emojis }) {
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
      <h2 className="text-xl mt-6 mb-2">Steam Emojis</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {emojis.map((emoji, idx) => (
          <a
            key={idx}
            href={`https://community.fastly.steamstatic.com/economy/image/${emoji.icon}/330x192?allow_animated=1`}
            target="_blank"
            rel="noopener noreferrer"
            title={emoji.title}
            className="block"
          >
            <img
              src={`https://community.fastly.steamstatic.com/economy/image/${emoji.icon}/96x96?allow_animated=1`}
              alt={emoji.title}
              className="w-full h-auto rounded shadow"
            />
            <div className="text-xs mt-1 text-center truncate">{emoji.title}</div>
            <div className="flex flex-wrap justify-center gap-1 mt-1">
              {emoji.tags.map((tag, i) => (
                <span key={i} className="bg-gray-200 rounded px-2 py-0.5 text-[10px]">{tag}</span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  if (!req.user) {
    return { redirect: { destination: '/', permanent: false } };
  }
  let inventory = null;
  let emojis = [];
  try {
    inventory = await fetchInventory(req.user._json.steamid);
    emojis = await fetchEmojis(req.user._json.steamid);
    // Test request for MiniProfileBackground API
    await testMiniProfileBackground(req.user._json.steamid);
  } catch (e) {
    inventory = { error: e.message };
    emojis = [];
  }
  return { props: { user: req.user, inventory, emojis } };
}
