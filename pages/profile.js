export default function Profile({ user }) {
  if (!user) return <div className="p-8">Not authenticated</div>;
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <img src={user.photos?.[0]?.value} className="w-24 h-24 rounded-full" alt="avatar" />
      <p className="mt-4 text-lg">{user.displayName}</p>
      <pre className="mt-6 bg-black/40 p-4 rounded text-xs w-full max-w-xl overflow-x-auto">
        {JSON.stringify(user._json, null, 2)}
      </pre>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  if (!req.user) {
    return { redirect: { destination: '/', permanent: false } };
  }
  return { props: { user: req.user } };
}
