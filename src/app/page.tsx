export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center gap-6 px-6 py-16">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Sleep Coder
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Next.js 14 + TypeScript + Tailwind CSS
        </h1>
        <p className="text-base leading-7 text-slate-600">
          The project structure is ready. Update components in src/components and
          shared utilities in src/lib.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
        Start editing <span className="font-mono">src/app/page.tsx</span> to
        customize this screen.
      </div>
    </main>
  );
}
