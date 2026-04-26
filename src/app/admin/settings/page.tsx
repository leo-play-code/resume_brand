import { getSiteSettings, updateSiteSettings } from "@/lib/actions/settings";
import SettingsAdminClient from "./SettingsAdminClient";

export default async function SettingsPage() {
  const settings = await getSiteSettings();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-fg mb-2">Settings</h1>
      <p className="text-fg-35 text-sm mb-8">Customize site appearance.</p>
      <SettingsAdminClient settings={settings} updateSettings={updateSiteSettings} />
    </div>
  );
}
