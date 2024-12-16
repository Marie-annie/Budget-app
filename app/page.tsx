import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="text-center py-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Budget App</h1>
      <p className="mb-6">Manage your transactions and categories effortlessly.</p>
      <div className="space-x-4">
        <Link href="/auth/register">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">Register</button>
        </Link>
        <Link href="/auth/login">
          <button className="px-4 py-2 bg-green-500 text-white rounded">Login</button>
        </Link>
      </div>
    </div>
  );
}
