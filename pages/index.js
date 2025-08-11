import Link from 'next/link';

export default function Home({ user }) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Anime Stream</h1>
      {user ? (
        <div>
          <img src={user.photos?.[0]?.value} alt="avatar" className="w-16 h-16 rounded" />
          <p className="mt-2">Hello {user.displayName}</p>
          <Link href="/profile" className="text-blue-500">
            Profile
          </Link>
        </div>
      ) : (
        <a href="/api/auth/steam" className="bg-blue-500 text-white px-4 py-2 rounded">
          Login with Steam
        </a>
      )}
    </div>
  );
}

export async function getServerSideProps({ req }) {
  return { props: { user: req.user || null } };
}
