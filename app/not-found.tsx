import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-archive-cream px-4">
      <section className="max-w-xl rounded border border-archive-navy/12 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-archive-brown">404</p>
        <h1 className="mt-3 font-serif text-4xl text-archive-navy">This archive page does not exist.</h1>
        <p className="mt-4 text-slate-700">The page may have moved, or it may not have been published yet.</p>
        <Link className="mt-6 inline-flex rounded bg-archive-navy px-5 py-3 text-sm font-semibold text-white" href="/">
          Return home
        </Link>
      </section>
    </main>
  );
}
