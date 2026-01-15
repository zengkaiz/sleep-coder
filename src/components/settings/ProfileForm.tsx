export function ProfileForm() {
  return (
    <form className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
          头像
        </div>
        <div>
          <p className="text-sm font-medium text-slate-900">上传头像</p>
          <p className="mt-1 text-xs text-slate-500">
            支持 PNG/JPG，建议尺寸 200x200
          </p>
          <button
            className="mt-3 inline-flex items-center rounded-[8px] border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-500 hover:text-blue-600"
            type="button"
          >
            选择文件
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          用户名
          <input
            className="w-full rounded-[8px] border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="请输入用户名"
            type="text"
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700">
          邮箱
          <input
            className="w-full rounded-[8px] border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="name@example.com"
            type="email"
          />
        </label>
      </div>

      <div className="flex justify-end">
        <button
          className="inline-flex items-center rounded-[8px] bg-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
          type="button"
        >
          保存设置
        </button>
      </div>
    </form>
  );
}
