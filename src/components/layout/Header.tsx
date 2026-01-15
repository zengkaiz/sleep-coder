interface HeaderProps {
  title?: string;
}

export default function Header({ title = 'Dashboard' }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <p className="text-sm text-slate-500">Welcome back</p>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      </div>
      <button
        type="button"
        className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm transition hover:border-blue-400 hover:text-blue-600"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          AC
        </span>
        <span className="font-medium">Alex Chen</span>
        <span className="text-xs">▼</span>
      </button>
    </header>
  );
}
