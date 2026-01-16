export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 text-slate-600">The page you are looking for doesn’t exist.</p>
    </div>
  );
}
