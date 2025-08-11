import Link from 'next/link';

export default function Home({ user }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 flex flex-col items-center justify-center text-white p-8">
      <h1 className="text-5xl font-extrabold mb-8 tracking-tight">Anime Stream</h1>
      {user ? (
        <div className="flex flex-col items-center bg-black/40 p-6 rounded-xl">
          <img src={user.photos?.[0]?.value} alt="avatar" className="w-20 h-20 rounded-full" />
          <p className="mt-3 text-lg">Hello {user.displayName}</p>
          <Link href="/profile" className="mt-4 underline text-white/80 hover:text-white">
            Profile
          </Link>
        </div>
      ) : (
        <a href="/api/auth/steam" className="btn-primary mt-4">
          Login with Steam
        </a>
      )}
    </div>
  );
}

export async function getServerSideProps({ req }) {
  return { props: { user: req.user || null } };
}
