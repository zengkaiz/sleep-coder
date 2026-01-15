import { ProfileForm } from "../../components/settings/ProfileForm";
import { SettingsCard } from "../../components/settings/SettingsCard";

interface ToggleRowProps {
  id: string;
  title: string;
  description: string;
  defaultChecked?: boolean;
}

function ToggleRow({
  id,
  title,
  description,
  defaultChecked = false,
}: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[8px] border border-slate-100 bg-slate-50 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-slate-900">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          className="peer sr-only"
          defaultChecked={defaultChecked}
          id={id}
          type="checkbox"
        />
        <div className="h-6 w-11 rounded-full bg-slate-200 transition peer-checked:bg-blue-500 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition peer-checked:after:translate-x-5" />
      </label>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] px-6 py-10 text-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Settings
          </p>
          <h1 className="text-3xl font-bold tracking-tight">设置中心</h1>
          <p className="text-base text-slate-500">
            管理个人资料、通知偏好与账户安全配置。
          </p>
        </header>

        <SettingsCard
          description="更新头像、用户名和邮箱信息。"
          title="个人信息"
        >
          <ProfileForm />
        </SettingsCard>

        <SettingsCard
          description="选择你希望接收的消息提醒方式。"
          title="通知设置"
        >
          <div className="space-y-3">
            <ToggleRow
              defaultChecked
              description="重要更新通过邮件发送到你的收件箱。"
              id="email-notifications"
              title="邮件通知"
            />
            <ToggleRow
              description="手机端推送实时提醒。"
              id="push-notifications"
              title="推送通知"
            />
          </div>
        </SettingsCard>

        <SettingsCard
          description="提升账户安全性，保障敏感信息。"
          title="安全设置"
        >
          <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-[8px] border border-slate-100 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">修改密码</p>
                <p className="mt-1 text-xs text-slate-500">
                  建议定期更新密码以保障账户安全。
                </p>
              </div>
              <button
                className="inline-flex items-center justify-center rounded-[8px] border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-500 hover:text-blue-600"
                type="button"
              >
                进入修改
              </button>
            </div>
            <ToggleRow
              description="登录时需要额外验证码验证。"
              id="two-factor-auth"
              title="两步验证"
            />
          </div>
        </SettingsCard>
      </div>
    </main>
  );
}
