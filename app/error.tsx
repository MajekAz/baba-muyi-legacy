"use client";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  console.error(error);

  return (
    <main className="grid min-h-screen place-items-center bg-archive-cream px-4">
      <section className="max-w-xl rounded border border-archive-navy/12 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-archive-brown">Something went wrong</p>
        <h1 className="mt-3 font-serif text-4xl text-archive-navy">The archive could not load this view.</h1>
        <p className="mt-4 text-slate-700">Please try again. The technical details have been kept out of the public page.</p>
        <button className="mt-6 rounded bg-archive-navy px-5 py-3 text-sm font-semibold text-white" onClick={reset} type="button">
          Try again
        </button>
      </section>
    </main>
  );
}
