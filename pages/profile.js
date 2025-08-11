export default function Profile({ user }) {
  if (!user) return <div className="p-8">Not authenticated</div>;
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Profile</h1>
      <img src={user.photos?.[0]?.value} className="w-24 h-24 rounded" alt="avatar" />
      <p className="mt-2">{user.displayName}</p>
      <pre className="mt-4 bg-gray-200 p-2 rounded text-xs overflow-x-auto">
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
